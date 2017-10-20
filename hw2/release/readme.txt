Readme

Guo, Jiayu

Hyper Marco 1.01

5/25/17

 
This game has been inspired by "Super Mario" game by Nintendo Corp. 

Hyper Marco is NOT Super Mario, technically

The game music is "8-bit desert tune", https://www.youtube.com/watch?v=7CaoOAgagxM

The intro (loading) music comes from "Soviet Connection", Grand Theft Auto 4, Rockstar Game

As a result, this game is for educational use only.

The sound effect of counting down from 3 to 1 credits to Yijing Jiang


The loading portion could be embarrassing, and that's trolling because nothing's being load at that time. 


Control:

alt+a to start

 "l" -> move forward  "j" ->  move backward  "i" -> jump.  "t": turn on fps





• [4 points] Make use of hierarchical objects with at least three levels (e.g., a human arm)

	draw_turtle -> draw turtle leg -> draw turtle leg segment (consist of two segments): 

	component.js: 543-565, 582
• [4 points] Demonstrate the camera tracking a moving object sometime, by overwriting the camera matrix using  lookAt() .

	component.js: 213, 281, 292

• [6 points] Design polygonal objects of your own to supplement the existing ones. To specify these shapes you must providenovel positions, normals, and texture coordinates to the graphics card by extending class Shape().

	shape,js: 326

• [2 points] Assign reasonable texture coordinates to, and texture, an instance of your custom polygonal object. Either texture itby mapping an image file, or procedurally (more like the Funny_Shader demo).


	txt coord: shape.js: 334;  texture: component.js: 115 (crispy chicken, i.e. red-blue texture using my customized texture coordinates) 

• [2 points] Your texture coordinates from the previous step must be designed to create an abrupt transition (discontinuity) alongsome edge(s) of the shape. Flat shading should be evident there when drawn and lit with the provided Phong reflection model.

	shape.js; 326.  Discontinued texture: shape.js: 334

	The customized shape is "Pentahedron" @ the bottom of shape.js, which is used for the purple indicator on top of the player. We can spot the discontinuity on the blue-red crystal texture on it. 
• [2 points] Real-time speed. 

	yes, by turning on FPS/frame count by pressing "t", there's animation time shown indicates that the game time approx. equals to the real-time

 • [2 points] Display the frame rate of your program on the graphics window, taking advantage of the update_strings() method thateach Scene_Component object runs each frame.


yes, by pressing "t"

• [4 points] Creativity (story, aesthetic style, etc).• [4 points] Complexity and impressive underlying mechanics.• [5 points] Overall quality: Fluidity of object and camera motion,  attention to detail  in scene construction, etc.




