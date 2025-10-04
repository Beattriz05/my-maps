## 📍 MY MAPS
<h4>Visão geral</h4>

Este projeto é um aplicativo móvel (Android/iOS) desenvolvido em React Native com Expo para demonstrar o rastreamento e a visualização da localização do usuário em tempo real.
Ele simula um sistema de rastreamento robusto, onde as coordenadas GPS são continuamente coletadas pelo dispositivo móvel e sincronizadas com um serviço de backend para permitir a monitorização ao vivo

<h4>Funcionalidade</h4>

- Localização em tempo real

- Mapa interativo do Google Maps

- Marcador de posição atual

- Atualização automática de localização

- Controles de monitoramento

- Interface responsiva

- Performance otimizada

- Design moderno e intuitivo

<h4> Tecnóligica <h4>

React Native - Framework mobile

Expo - Plataforma de desenvolvimento

Google Maps SDK - Mapas e geolocalização

TypeScript - Tipagem estática

Expo Location - Acesso à localização

React Native Maps - Componentes de mapa

<h4> Pré-Requisitos </h4>

- Node.js (versão 16 ou superior)

- npm ou yarn

- Expo CLI

- Conta no Google Cloud Console

<h4>Instalação e Configuração</h4>

1. Clone o repositório

git clone https://github.com/Beattriz05/my-maps.git

cd my-maps

2. Instale as dependências

npm install

  ou

yarn install

3. Configure as chaves da API Google Maps
Para Android:

1- Acesse Google Cloud Console

2- Ative as APIs:

    -Maps SDK for Android

    -Maps SDK for iOS

3- Crie uma chave de API

4- No arquivo app.json, substitua:

"android": {

  "config": {

    "googleMaps": {

      "apiKey": "SUA_CHAVE_API_ANDROID_AQUI"

    }

  }

}

4. Instale as dependências específicas do Expo

npx expo install react-native-maps expo-location @expo/vector-icons

<h4> Como Executar </h4>

- Iniciar o projeto:

npx expo start

- Executar no Android:

npx expo start --android

- Build para Android:
npx eas build --platform android
