// Copyright 2021 The Alephium Authors
// This file is part of the alephium project.
//
// The library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the library. If not, see <http://www.gnu.org/licenses/>.

import { CliqueClient, ExplorerClient } from 'alephium-js'

// =================== //
// === API CLIENTS === //
// =================== //

export async function createClient(settings?: Settings) {
  const loadedSettings = settings || loadSettingsOrDefault()
  const cliqueClient = new CliqueClient({
    baseUrl: loadedSettings.nodeHost
  })

  const explorerClient = new ExplorerClient({
    baseUrl: loadedSettings.explorerApiHost
  })

  //If `nodeHost` have a port `....:12345`, we consider it as a multi-nodes clique
  const isMultiNodesClique = loadedSettings.nodeHost.match(/(:[0-9]+)$/) != null

  console.log('Multi-nodes clique: ' + isMultiNodesClique)
  console.log('Connecting to: ' + cliqueClient.baseUrl)
  console.log('Explorer backend: ' + explorerClient.baseUrl)

  // Init clients
  await cliqueClient.init(isMultiNodesClique)

  return { clique: cliqueClient, explorer: explorerClient }
}

// ================ //
// === SETTINGS === //
// ================ //

export interface Settings {
  nodeHost: string
  explorerApiHost: string
  explorerUrl: string
}

export function settingsDefault(): Settings {
  return {
    nodeHost: 'https://testnet-wallet.alephium.org',
    explorerApiHost: 'https://testnet-backend.alephium.org',
    explorerUrl: 'https://testnet.alephium.org'
  }
}

export function loadSettings(): Settings | null {
  const str = window.localStorage.getItem('settings')
  if (str) {
    return JSON.parse(str)
  } else {
    return null
  }
}

export function loadSettingsOrDefault() {
  const settings = loadSettings()
  if (!settings) {
    return settingsDefault()
  } else {
    return settings
  }
}

export function saveSettings(settings: Settings) {
  const str = JSON.stringify(settings)
  window.localStorage.setItem('settings', str)
}
