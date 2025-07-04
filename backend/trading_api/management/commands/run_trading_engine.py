import time
import logging
from django.core.management.base import BaseCommand
from trading_api.trading_engine import trading_engine

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Run the trading engine to execute strategies'

    def add_arguments(self, parser):
        parser.add_argument(
            '--interval',
            type=int,
            default=60,
            help='Interval in seconds between strategy executions'
        )
        
        parser.add_argument(
            '--user-id',
            type=int,
            help='Optional user ID to run strategies for a specific user only'
        )

    def handle(self, *args, **options):
        interval = options['interval']
        user_id = options.get('user_id')
        
        self.stdout.write(self.style.SUCCESS(f'Starting trading engine with interval {interval} seconds'))
        
        if user_id:
            from django.contrib.auth.models import User
            try:
                user = User.objects.get(id=user_id)
                self.stdout.write(f'Running for user: {user.username}')
            except User.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'User with ID {user_id} not found'))
                return
        else:
            user = None
            self.stdout.write('Running for all users')
        
        try:
            while True:
                start_time = time.time()
                
                # Execute strategies
                signals = trading_engine.execute_strategies(user)
                
                if signals:
                    self.stdout.write(f'Generated {len(signals)} trading signals')
                    for signal in signals:
                        self.stdout.write(f'  {signal["signal_type"]} {signal["symbol"]} @ {signal["price"]} ({signal["reason"]})')
                
                # Calculate sleep time to maintain the interval
                elapsed = time.time() - start_time
                sleep_time = max(0, interval - elapsed)
                
                if sleep_time > 0:
                    self.stdout.write(f'Sleeping for {sleep_time:.2f} seconds')
                    time.sleep(sleep_time)
                
        except KeyboardInterrupt:
            self.stdout.write(self.style.SUCCESS('Trading engine stopped'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error in trading engine: {str(e)}'))
            logger.exception('Trading engine error')