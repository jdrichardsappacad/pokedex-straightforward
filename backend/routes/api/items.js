const express = require('express');
const asyncHandler = require('express-async-handler');
const { check, validationResult } = require('express-validator');

const ItemsRepository = require('../../db/items-repository');

const itemValidations = require('../../validations/items');

const router = express.Router();

router.put(
  '/:id',
  itemValidations.validateUpdate,
  asyncHandler(async function (req, res) {
    const id = req.params.id;
    delete id;

    const item = await Item.update(req.body, {
      where: { id },
      returning: true,
      plain: true,
    });

    return res.json(item);
  })
);

router.delete(
  '/:id',
  asyncHandler(async function (req, res) {
    const item = await Item.findByPk(req.params.id);
    if (!item) throw new Error('Cannot find item');

    await Item.destroy({ where: { id: item.id } });

    return res.json({ itemId: item.id });
  })
);

module.exports = router;
