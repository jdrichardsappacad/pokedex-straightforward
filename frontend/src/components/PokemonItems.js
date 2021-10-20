import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getItems } from '../store/items';

const PokemonItems = ({ pokemon, setEditItemId }) => {
  const items = useSelector(state => {
    return pokemon.items?.map(itemId => state.items[itemId.id]);
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getItems(pokemon.id));
  }, [dispatch, pokemon.id]);

  return (
    <>
      {items?.map((item, id) => (
        <tr key={id}>
          <td>
            <img
              className='item-image'
              alt={`${item?.imageUrl}`}
              src={`${item?.imageUrl}`}
            />
          </td>
          <td>{item?.name}</td>
          <td className='centered'>{item?.happiness}</td>
          <td className='centered'>${item?.price}</td>
          {pokemon.captured && (
            <td className='centered'>
              <button onClick={() => setEditItemId(item?.id)}>Edit</button>
            </td>
          )}
        </tr>
      ))}
    </>
  );
};

export default PokemonItems;
