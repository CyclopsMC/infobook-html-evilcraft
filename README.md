# Cyclops Infobook HTML - EvilCraft

[![Build Status](https://travis-ci.org/CyclopsMC/infobook-html-evilcraft.svg?branch=master)](https://travis-ci.org/CyclopsMC/infobook-html-evilcraft)
[![Greenkeeper badge](https://badges.greenkeeper.io/CyclopsMC/infobook-html-evilcraft.svg)](https://greenkeeper.io/)

Output EvilCraft infobooks as HTML.

This makes use of the [Cyclops Infobook HTML](https://github.com/CyclopsMC/infobook-html) tool with Integrated Dynamics-specific appendix handlers.

## Registries

The following registries are created with this plugin:

* `registries/blood_infuser_recipe.json`: The blood infuser recipe registry.
* `registries/envir_acc_recipe.json`: The environmental accumulator registry.
* `registries/broom_modifiers.json`: The broom modifiers registry.

## Requirements

### Icon Generation

This phase should be done using the [Item Exporter mod](https://github.com/CyclopsMC/IconExporter).

Simply create a modpack with all the mods that were downloaded in the previous step (including the Item Exporter mod),
start a world, and run the `/iconexporter export 64` command.

Next, copy the resulting contents of `icon-exports-x64` to `icons` in your project directory.

### Configuration

Configure the generator using the following files:

* `modpack.json`: The mods that should be loaded during metadata generation.
* `config.json`: HTML serialization settings.

## Usage

Executing `npm run generate` will do two things:

1. Generate metadata by starting a temporary Forge server.
2. Output HTML to `output/`.

## License
This software is written by [Ruben Taelman](http://rubensworks.net/).

This code is released under the [MIT license](http://opensource.org/licenses/MIT).