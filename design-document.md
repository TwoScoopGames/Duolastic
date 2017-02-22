# Duolastic design document
 Cube in space version

## elements

### Cube
- 6 sided white cube floating in space
- the cube has a glossy white surface which other elements reflect onto
- light comes from an angle as to cast small shadows in one direction

### Players
- 12-layered cones made of rainbow colored cylinders
- player two's colors are in reverse order of player one
- Players move like tall jello molds on a plate where only the plate is moved causing the jello to react and snap back into upright position when stopped.

### Ball
- Shiny silver sphere

### Camera
??Camera angle looks at top of the cube at an angle where one side face is toward the camera.

### Background
You are floating in space, stars and galaxies visible moving in background




## Screens

### Home screen
- shows title of game and two options
[Find a random match] and  [Play with someone you know]

### Matchmaking
- [Find a random match] - Players are matched at random where a player waits for the next 'random mode' player to arrive on the site, then they are paired and the game begins

- [Play with someone you know] - User is provided a randomly generated 'game name' which will create a unique link to give to another player, they are matched until one player quits from the rematch screen

#### Rematch Screen
options  [leave match] and [rematch] are displayed.
- Players both select rematch - new match starts
- one player chooses [leave match] -> this player is taken to home screen, other player gets "Player left" message then is given one option [return to home] when clicked the player is taken to home screen
- both players choose [leave match] -> both are taken to home screen




## Game Loop

- Players are on "top" of the Cube at all times

- Players are controlled with arrow keys, WASD, or controller analogue stick


- `goal` The farthest edge of the top of the cube on a given players side. Players try to bounce the ball past the opponent and past the opponent's goal, this results in scoring a point.

- `point` - player gets ball past other player's goal once
- `round` - set of goals
- `match` - set of rounds


- A round can have 1 or more points. a match can have one or more rounds.

- Scoring works by number of points, whoever scores the most points wins the round.
 The player to wins the most rounds wins the match, then a rematch screen is displayed.

- the side of the court cube closest to you flashes success color(ex. blue) when you score a goal, warning color(ex. red) when you have a goal scored on you
  - player that lost jiggles in frustration (possibly particles)
  - player who scored "jumps" (each part of the players stack separates, moves up, then tweens back together)

- Players have two 'modes' - `Cone` and `Funnel` - the modes are switched via pressing space on the keyboard or 'a' on the gamepad.

  - `Cone mode` - Player is above ground and can move freely, player hits the ball, walls, pegs, or other players by bumping.

  - `Funnel mode` - Player is stuck in the ground where the mode was activated. Player cannot move and can only choose to switch modes. If ball touches player in funnel mode, ball falls into the player, at this time the player can "point" to a direction when they switch back into cone mode and the ball will shoot out of the player at a fast rate of speed in the selected direction
    - The player in funnel mode hears all sounds in reverse (duplicate audio files)


### Levels
The cube rotates after each goal(or round) introducing another side (level) with progressively more difficult obstacles in the court.
Since a cube has 6 sides, 6 levels can be played.

Example:
- side 1 no obstacles, plain white surface.
- side 2: one small “peg” (cylinder) in center
- side 3. 2-3 small pegs
- side 4: small peg and small wall

Funnel mode becomes more strategic because a player can hide behind a wall at an angle which allows the ball to roll into you



## Future ideas and posibilities


- players pick which level(side of cube) to play on
- players can pick number of points in a round, and or number of rounds in a match
- players are given a randomly generated GUID which we can base a procedurally generated username off of
- players are assigned random name
- leaderboards for most matches won
