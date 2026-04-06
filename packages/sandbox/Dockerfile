FROM alpine:3.20

# Install runtime packages FIRST
RUN apk add --no-cache \
    python3 \
    build-base \
    cjson-dev \
    ca-certificates \
    libc6-compat \
    libstdc++

# Install Bun using temp deps
RUN apk add --no-cache --virtual .build-deps curl unzip \
    && curl -fsSL https://github.com/oven-sh/bun/releases/latest/download/bun-linux-x64.zip -o bun.zip \
    && unzip bun.zip \
    && mv bun-linux-x64/bun /usr/local/bin/bun \
    && rm -rf bun.zip bun-linux-x64 \
    && apk del .build-deps \
    && apk del ca-certificates

RUN apk add --no-cache --virtual .json-deps curl ca-certificates \
    && mkdir -p /usr/local/include/nlohmann \
    && curl -fsSL https://github.com/nlohmann/json/releases/download/v3.11.3/json.hpp \
    -o /usr/local/include/nlohmann/json.hpp \
    && apk del .json-deps

WORKDIR /app
CMD ["sh"]