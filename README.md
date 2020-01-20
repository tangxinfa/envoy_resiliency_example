A example project for learn how to build resiliency service with envoy.

# Run

## Start service

    docker-compose up -d

## Stress test on service

    while [ 1 ]; do curl -i localhost:8000/service/unstable_hello; sleep 0.1; done;

## Inject fault into instance1

    docker exec "resiliency_example-instance1" /bin/sh -c 'wget "localhost/service/inject_fault/1.5" -O-'

## Recover instance1

    docker exec "resiliency_example-instance1" /bin/sh -c 'wget "localhost/service/inject_fault/0" -O-'

## Stop service

    docker-compose down
