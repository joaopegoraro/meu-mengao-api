<p align="center">
  <img src="./logo.png?raw=true" width="200" alt="Meu Mengão Logo" />
</p>

<h1 align="center"> Meu Mengão API </h1>

<p align="center">
NestJS API that scrapes the top news and sport sites for Flamengo's news, fixtures, results and standings, and exposes it through some endpoints.
Made for the  
<a href="https://github.com/joaopegoraro/meu-mengao">Meu Mengão App.</a></p>


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Endpoints


## Get list of news articles

### Request

`GET /noticias`

### Response
```json
{
  [
    "id": 12345,
    "link": "https://somesite.com/some_article",
    "data": "1688689100456", // Milliseconds since epoch
    "titulo": "Title",
    "logoSite": "<Base 64 string of the logo of the article's site>",
    "foto": "<Base 64 string of the article's main image>"
  ]
}
```

## Get the details of the upcoming match

### Request

`GET /partidas/proxima`

### Response
```json
{
  "id": "djfKa#21",
  "campeonato": "Libertadores",
  "campeonatoId": "libertadores",
  "data": "1688689100456", // Milliseconds since epoch
  "rodadaName": "Oitavas de Final",
  "rodadaIndex" 1, // the position of the round in relation to other rounds, 0 is the oldest round
  "timeCasa": "Flamengo",
  "golsCasa": "3",
  "timeFora": "Fluminense",
  "golsFora": "0",
  "escudoCasa": "<Base 64 string of the home team logo>",
  "escudoFora": "<Base 64 string of the away team logo>"
}
```

## Get list of the already played matches (results)

### Request

`GET /partidas/resultados`

### Response
```json
{
  [
    "id": "djfKa#21",
    "campeonato": "Libertadores",
    "campeonatoId": "libertadores",
    "data": "1688689100456", // Milliseconds since epoch
    "rodadaName": "Oitavas de Final",
    "rodadaIndex" 1, // the position of the round in relation to other rounds, 0 is the oldest round
    "timeCasa": "Flamengo",
    "golsCasa": "3",
    "timeFora": "Fluminense",
    "golsFora": "0",
    "escudoCasa": "<Base 64 string of the home team logo>",
    "escudoFora": "<Base 64 string of the away team logo>"
  ]
}
```

## Get list of the upcoming matches (calendar)

### Request

`GET /partidas/calendario`

### Response
```json
{
  [
    "id": "djfKa#21",
    "campeonato": "Libertadores",
    "campeonatoId": "libertadores",
    "data": "1688689100456", // Milliseconds since epoch
    "rodadaName": "Oitavas de Final",
    "rodadaIndex" 1, // the position of the round in relation to other rounds, 0 is the oldest round
    "timeCasa": "Flamengo",
    "golsCasa": "3",
    "timeFora": "Fluminense",
    "golsFora": "0",
    "escudoCasa": "<Base 64 string of the home team logo>",
    "escudoFora": "<Base 64 string of the away team logo>"
  ]
}
```


## Get list of the championships Flamengo is enrolled in

### Request

`GET /campeonatos`

### Response
```json
{
  [
    "id": "libertadores",
    "nome": "Libertadores", 
    "ano": "2023", 
    "logo": "<Base 64 string of the championship logo>",
    "rodadaAtual": 1, // index of the most recent round
    "possuiClassificacao": false, // wheter or not the championship has a standings table
  ]
}
```

## Get standings of selected championship

### Request

`GET /posicao/campeonato/{id}`

### Response
```json
{
  [
    "id": "someRandomId",
    "posicao": "1",
    "nomeTime": "Flamengo", 
    "escudoTime": "<Base 64 string of the team logo>",
    "pontos": "90",
    "jogos": "38",
    "vitorias": "28",
    "empates": "6",
    "derrotas": "4",
    "golsFeitos": "86",
    "golsSofridos": "37",
    "saldoGols": "49",
    "campeonatoId": "serie-a",
    "classificacaoName": "Grupo A",
    "classificacaoIndex": 0
  ]
}
```

## Get list of the championship matches

### Request

`GET /partidas/campeonato/{id}`

### Response
```json
{
  [
    "id": "djfKa#21",
    "campeonato": "Libertadores",
    "campeonatoId": "libertadores",
    "data": "1688689100456", // Milliseconds since epoch
    "rodadaName": "Oitavas de Final",
    "rodadaIndex" 1, // the position of the round in relation to other rounds, 0 is the oldest round
    "timeCasa": "Flamengo",
    "golsCasa": "3",
    "timeFora": "Fluminense",
    "golsFora": "0",
    "escudoCasa": "<Base 64 string of the home team logo>",
    "escudoFora": "<Base 64 string of the away team logo>"
  ]
}
```