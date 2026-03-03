// store/cartReducer.js
export const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const product = action.payload;
      const itemKey = product.selectedColor 
        ? `${product.id}_${product.selectedColor.code}` 
        : product.id;
      const existingItem = state.items.find(item => item.itemKey === itemKey);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.itemKey === itemKey
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            ...product,
            itemKey,
            selectedColor: product.selectedColor,
            quantity: 1,
          },
        ],
      };
    }

    case "REMOVE_FROM_CART": {
      const { id, color } = action.payload;
      const itemKey = color ? `${id}_${color.code}` : id;
      return {
        ...state,
        items: state.items.filter((item) => item.itemKey !== itemKey),
      };
    }

    case "INCREASE_QUANTITY": {
      const { id, color } = action.payload;
      const itemKey = color ? `${id}_${color.code}` : id;
      return {
        ...state,
        items: state.items.map((item) =>
          item.itemKey === itemKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }

    case "DECREASE_QUANTITY": {
      const { id, color } = action.payload;
      const itemKey = color ? `${id}_${color.code}` : id;
      return {
        ...state,
        items: state.items.map((item) =>
          item.itemKey === itemKey && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
};