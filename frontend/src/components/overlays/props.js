export default {
  p1: {
    type: Object,
    required: true,
  },
  p2: {
    type: Object,
    required: true,
  },
  match: { type: String, required: true },
  bestOf: { type: Number, default: 3 },
  flipPlayers: { type: Boolean, default: false },
  event: { type: String, required: true },
  grands: { type: Boolean, default: false },
};
