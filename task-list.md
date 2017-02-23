
# Home screen

## non-prioritized
- shows title of game and two options
[Find a random match] and  [Play with someone you know]

# Matchmaking

## non-prioritized
- players are given a randomly generated GUID which we can base a procedurally generated username off of
- players are assigned random name
- [Find a random match] - Players are matched at random where a player waits for the next 'random mode' player to arrive on the site, then they are paired and the game begins

- [Play with someone you know] - User is provided a randomly generated 'game name' which will create a unique link to give to another player, they are matched until one player quits from the rematch screen

# Rematch Screen

## non-prioritized

options  [leave match] and [rematch] are displayed.
- Players both select rematch - new match starts
- one player chooses [leave match] -> this player is taken to home screen, other player gets "Player left" message then is given one option [return to home] when clicked the player is taken to home screen
- both players choose [leave match] -> both are taken to home screen


# Game Loop

## prioritized

1. The player to wins the most rounds wins the match, then a rematch screen is displayed.

2. Gamepad support
  - Tested working: PS4 (mac) and XBox 360 (mac/linux)
  - Issue with player 2

3. `Funnel mode` MVP
  - press button to toggle modes (cone/funnel)
  - directional controls do not allow player to move
  - player changes to single cylinder (the actual player entity remains?)
  - if ball touches player ball follows player
  - direction player points directional controls is the direction the ball will "launch" when mode is toggled again


## non-prioritized

- `Funnel mode` Final
  - Player becomes funnel into the ground
    - cut out hole the shape of the player's bottom cylinder in the cube?
    - lighting/ adjustments to make the funnel look right
  - The player in funnel mode hears all sounds in reverse (duplicate audio files)

- get shadows working

- Players move like tall jello molds on a plate where only the plate is moved causing the jello to react and snap back into upright position when stopped.

- Shiny silver sphere
  - needs to be shinier

- You are floating in space, stars and galaxies visible moving in background
  - Skybox rotating on it's z axis forever ?
  - quaternionSlerp ?

- `round` - set of goals
- `match` - set of rounds

- the side of the court cube closest to you flashes success color(ex. blue) when you score a goal, warning color(ex. red) when you have a goal scored on you
  - player that lost jiggles in frustration (possibly particles)
  - player who scored "jumps" (each part of the players stack separates, moves up, then tweens back together)

- Levels - The cube rotates after each goal(or round) introducing another side (level) with progressively more difficult obstacles in the court.
  - Since a cube has 6 sides, 6 levels can be played.
  - side 1 no obstacles, plain white surface.
  - side 2: one small “peg” (cylinder) in center
  - side 3. 2-3 small pegs
  - side 4: small peg and small wall


## not decided on

- [17-02-23 : eric] instead of shooting the puck into the goal, maybe you have to shoot the puck into another "ghost" puck that you can't touch directly and use the bounce force to push the ghost puck into the goal
- players pick which level(side of cube) to play on
- players can pick number of points in a round, and or number of rounds in a match
- leaderboards for most matches won
