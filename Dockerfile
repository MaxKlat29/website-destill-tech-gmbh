FROM caddy:2.11.7-alpine
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY sites /srv/
