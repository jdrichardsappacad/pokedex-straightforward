import { LOAD_ITEMS, REMOVE_ITEM, ADD_ITEM } from './items';

const LOAD = 'pokemon/LOAD';
const LOAD_TYPES = 'pokemon/LOAD_TYPES';
const ADD_ONE = 'pokemon/ADD_ONE';

const load = list => ({
  type: LOAD,
  list,
});

const loadTypes = types => ({
  type: LOAD_TYPES,
  types,
});

const addOnePokemon = pokemon => ({
  type: ADD_ONE,
  pokemon,
});

export const createPokemon = data => async dispatch => {
  const response = await fetch(`/api/pokemon`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const pokemon = await response.json();

    dispatch(addOnePokemon(pokemon));
    return pokemon;
  }
};

export const updatePokemon = data => async dispatch => {
  const response = await fetch(`/api/pokemon/${data.id}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const pokemon = await response.json();
    dispatch(addOnePokemon(pokemon));
    return pokemon;
  }
};

export const getOnePokemon = id => async dispatch => {
  const response = await fetch(`/api/pokemon/${id}`);

  if (response.ok) {
    const pokemon = await response.json();
    dispatch(addOnePokemon(pokemon));
  }
};

export const getPokemon = () => async dispatch => {
  const response = await fetch(`/api/pokemon`);

  if (response.ok) {
    const list = await response.json();
    dispatch(load(list));
  }
};

export const getPokemonTypes = () => async dispatch => {
  const response = await fetch(`/api/pokemon/types`);

  if (response.ok) {
    const types = await response.json();
    dispatch(loadTypes(types));
  }
};

const initialState = {
  allPokemon: {},
  types: [],
};

const pokemonReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD: {
      const pokemonObj = {};
      action.list.forEach(pokemon => {
        pokemonObj[pokemon.id] = pokemon;
      });

      return {
        ...state,
        allPokemon: pokemonObj,
      };
    }
    case LOAD_TYPES: {
      return {
        ...state,
        types: action.types,
      };
    }
    case ADD_ONE: {
      if (!state.allPokemon[action.pokemon.id]) {
        console.log('i do not exist', action.pokemon);
        return {
          ...state,
          allPokemon: {
            ...state.allPokemon,
            [action.pokemon.id]: action.pokemon,
          },
        };
      } else {
        console.log(
          'i exist',
          state.allPokemon[action.pokemon.id],
          action.pokemon
        );
        return {
          ...state,
          allPokemon: {
            ...state.allPokemon,
            [action.pokemon.id]: {
              ...state.allPokemon[action.pokemon.id],
              ...action.pokemon,
            },
          },
        };
      }
    }

    case LOAD_ITEMS: {
      return {
        ...state,
        allPokemon: {
          ...state.allPokemon,
          [action.pokemonId]: {
            ...state.allPokemon[action.pokemonId],

            items: [...action.items],
          },
        },
      };
    }
    case REMOVE_ITEM: {
      return {
        ...state,
        [action.pokemonId]: {
          ...state[action.pokemonId],
          items: state[action.pokemonId].filter(
            item => item.id !== action.itemId
          ),
        },
      };
    }
    case ADD_ITEM: {
      return {
        ...state,
        [action.item.pokemonId]: {
          ...state[action.item.pokemonId],
          items: [...state[action.item.pokemonId], action.item.id],
        },
      };
    }
    default:
      return state;
  }
};

export default pokemonReducer;
