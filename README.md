# Double Road
An original game developed and design by me using phaser and TypeScript. An endless game focused on reaction time

<p align="center">
  <img src='https://github.com/AfonsoCFonseca/DoubleRoad-Game/blob/master/screenshots/logo.png'>
</p>


---------------------------------------------------------------
# Structure

Created with 4 main Classes to manage the full game

### App ###
The app is responsible for handling all the main game management such as scoring, levels, gameOvers, resets.

### Map ###
The Map class functionality is to draw the map screen, move it downward, removing in a specific Y position and create a new one in 
the top of the screen.

### Player ###
The Player is configured by an abstract class extended by the LeftCar and RightCar. It handles the car sprite animation, the movement
and the reseting car position.

### Enemy Spawner ###
The Spawner is responsible for creating two enemies in a pre-determined time, storing and managing an array of enemies, deleting 
and removing them from the array, when they leave the screen.

### Enemy ###
An abstract class made with the expectation of creating different enemies. By now, only exists a NormalEnemy class
This class only draws the enemy, moves it and calls for deletion when reaching the end of the screen.

### Leaderboard ###
Made to handle every requests with the BE, since the BE is mostly leaderboard and user management requests.
The UI for this class shows my position in the Leaderboard table, the 3 players before and after me.


---------------------------------------------------------------
# Development
This game was created from a previous game of mine, developed in Unity and launched in Android, around 2015, named "OMG Cars!"

Started the development by positioning the two car players on the screen and giving them movement when pressing a key or touching a screen. After that created
the EnemySpawner, set the spawn times right and created an Enemy class with a Y-axis movement. Applied the collider to give meaning to the game mechanic.

Then, I tuned the spawn time, car speed and road speed to give some balanced incremental difficulty curve.

Made a few car sprites, applied some animations to the car player, created a Game Over Screen with a scoring system and a Starting Screen
By then, I had created the enemy car movement and the road movement to give the feeling the player was going against the cars but the movement was not very fluidly. 
So, I changed the Y axis speed of the enemy and road to look like the player was in the right direction but going faster than the other cars

Created a BE relation with the creation of a Leaderboard. I've created a DB in Google Firestore ( no-SQL DB ). Made a single collection that saves each user, with score, timestamp and username.
A document is created when a new user starts a session without cookie.
When the gameover screen is shown, the BE is requested for the current user position in the table and his nearest players, in order to created the LeaderBoard UI.
I created a security middleware in each request that can be used for a whitelist policy or authorization token verification. At this time i didn't used any middleware and made a different security approach.

To finish the development of the project, I implemented the pause menu with a continue button and retry button

# Future Implementation

- Add a currency and the possibility of buying different cars 
- Change the game for better sprites
- Change the game UI
- Build the game for Facebook Messenger game app

---------------------------------------------------------------
# Sketches & Evolution

 <p float="left">
   <img width="186" height="235" src='https://github.com/AfonsoCFonseca/DoubleRoad-Game/blob/master/screenshots/30_05.png' >
   <img width="186" height="235" src='https://github.com/AfonsoCFonseca/DoubleRoad-Game/blob/master/screenshots/30_05_part2.png' >
   <img width="186" height="235" src='https://github.com/AfonsoCFonseca/DoubleRoad-Game/blob/master/screenshots/20_06.png' >
   <img width="146" height="235" src='https://github.com/AfonsoCFonseca/DoubleRoad-Game/blob/master/screenshots/03_07.png' >

 </p>
