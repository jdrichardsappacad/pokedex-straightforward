const express = require('express');
const asyncHandler = require('express-async-handler');
const { check, validationResult } = require('express-validator');
const { types } = require('../../db/models/pokemonType');

const { Pokemon, Item } = require('../../db/models');

// these repositories have utility functions that you can use inside routes
const ItemsRepository = require('../../db/items-repository');
const PokemonRepository = require('../../db/pokemon-repository');

const pokemonValidations = require('../../validations/pokemon');
const itemValidations = require('../../validations/items');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async function (_req, res) {
    const pokemon = await PokemonRepository.list();
    return res.json(pokemon);
  })
);

router.post(
  '/',
  pokemonValidations.validateCreate,
  asyncHandler(async function (req, res) {
    //generateItems function is in pokemon-repository file
    req.body.items = await [...PokemonRepository.generateItems()];

    //random number designates captured or not captured
    const num = await PokemonRepository.randomNumber();
    req.body.captured = num > 40 ? true : false;

    const pokemon = await Pokemon.create(req.body, { include: ['items'] });
    return res.json(pokemon);
  })
);

router.put(
  '/:id',
  pokemonValidations.validateUpdate,
  asyncHandler(async function (req, res) {
    const id = req.params.id;
    const foundPokemon = await Pokemon.findByPk(id);
    const pokemon = await foundPokemon.update(req.body);

    return res.json(pokemon);
  })
);

router.get(
  '/types',
  asyncHandler(async function (_req, res) {
    return res.json(types);
  })
);

router.get(
  '/random',
  asyncHandler(async function (_req, res) {
    const pokemon = await PokemonRepository.random();
    return res.json(pokemon);
  })
);

router.get(
  '/battle',
  asyncHandler(async function (req, res) {
    const pokemon = await PokemonRepository.battle(
      req.query.allyId,
      req.query.opponentId
    );
    return res.json(pokemon);
  })
);

router.get(
  '/:id',
  asyncHandler(async function (req, res) {
    const pokemon = await Pokemon.findByPk(req.params.id);
    return res.json(pokemon);
  })
);

router.get(
  '/:id/items',
  asyncHandler(async function (req, res) {
    const pokemonId = req.params.id;
    const items = await Item.findAll({
      where: {
        pokemonId,
      },
    });

    return res.json(items);
  })
);

router.post(
  '/:id/items',
  itemValidations.validateCreate,
  asyncHandler(async function (req, res) {
    const item = await ItemsRepository.addItem(req.body, req.params.id);
    return res.json(item);
  })
);

module.exports = router;
