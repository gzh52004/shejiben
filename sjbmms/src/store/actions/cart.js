/**
 * Action Creator
 */

export function add(goods) {
  return {
    type: "add_to_cart",
    goods,
  };
}

export function remove(id) {
  return {
    type: "remove_from_cart",
    id,
  };
}

export function changeQty(id, qty) {
  return {
    type: "change_qty",
    id,
    qty,
  };
}

export default {
  add,
  remove,
  changeQty,
  //...
};
