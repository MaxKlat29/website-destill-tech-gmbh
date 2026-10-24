FROM caddy:2.8.4-alpine
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY sites /srv/
