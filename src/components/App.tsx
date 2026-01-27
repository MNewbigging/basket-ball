import { Game } from "../game";
import "./app.scss";

const game = new Game();
game.start();

export function App() {
  return <div className="app"></div>;
}
