import { ManifestType } from 'vscode-manifest'
import jsonfile from 'jsonfile'

// TODO mock config in all tests to ensure stability

export const mockManifestOnce = (manifest: ManifestType) => {
    const spy = jest.spyOn(jsonfile, 'readFile')
    // TODO mock implementation with testing on path
    spy.mockResolvedValueOnce(JSON.parse(JSON.stringify(manifest)))
}

const deepFreeze = <T extends Record<string, any>>(obj: T) => {
    for (const [, value] of Object.entries(obj)) if (typeof value === 'object') deepFreeze(value)

    Object.freeze(obj)
    return obj
}

export const screenRecorderManifest: ManifestType = deepFreeze({
    name: 'screen-recorder',
    displayName: 'Screen Recorder',
    publisher: 'yatki',
    version: 'invalid-doesnt-matter',
    categories: ['Other'],
    devDependencies: {
        '@hediet/node-reload': '*',
    },
    contributes: {
        commands: [
            {
                // In this case both command and title would be prefixed
                command: 'startRecording',
                title: 'Start Screen Recording',
            },
            {
                command: 'editRecording',
                title: 'Edit Screen Recording',
                shortTitle: 'Edit',
                icon: '$(edit)',
            },
        ],
        configuration: {
            // title: 'Screen Recorder',
            properties: {
                recordSound: {
                    type: 'boolean',
                    // TODO make description optional when it means the same as setting id
                    default: false,
                    description: 'Record sound',
                },
                // TODO make no-sync and optional
                saveDir: {
                    type: 'string',
                    default: null,
                    description: '',
                },
                recordQuality: {
                    description: 'Record quality',
                    type: 'string',
                    enum: ['4K', 'FullHD', 'HD'],
                    default: '4K',
                },
            },
        },
        menus: {
            commandPalette: [
                {
                    command: 'startRecording',
                    when: '!virtualWorkspace',
                },
                {
                    command: 'editRecording',
                    when: 'resourceExtname == .mpeg',
                },
            ],
            'editor/title': [
                {
                    command: 'editRecording',
                    group: 'navigation',
                    when: 'resourceExtname == .mpeg',
                },
            ],
        },
    },
})