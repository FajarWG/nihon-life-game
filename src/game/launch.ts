/** Options handed from the React shell to the Phaser boot scene. */
export interface LaunchOptions {
  mode: "new" | "continue";
  playerName: string;
}

let options: LaunchOptions = { mode: "new", playerName: "Player" };

export function setLaunchOptions(o: LaunchOptions) { options = o; }
export function getLaunchOptions(): LaunchOptions { return options; }
