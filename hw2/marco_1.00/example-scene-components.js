// UCLA's Graphics Example Code (Javascript and C++ translations available), by Garett for CS174a.
// example-scene-components.js - The Scene_Component subclasses defined here describe different independent animation processes that you 
// want to fire off each frame, by defining a display event and how to react to key and mouse input events.  Create your own subclasses, 
// and fill them in with all your shape drawing calls and any extra key / mouse controls.

  // **********************************************************************************
  // First go down to the following class's display() method to see where the sample 
  // shapes you see drawn are coded, and a good place to begin filling in your own code.

Declare_Any_Class( "Example_Animation",  // An example of a Scene_Component that our class Canvas_Manager can manage.  This one draws the scene's 3D shapes.
  { 'construct'( context )
      { var shapes = { 'triangle'        : new Triangle(),                               // At the beginning of our program, instantiate all shapes we plan to use,
                       'strip'           : new Square(),                                // each with only one instance in the graphics card's memory.
                       'bad_tetrahedron' : new Tetrahedron( false ),                   // For example we would only create one "cube" blueprint in the GPU, but then 
                       'tetrahedron'     : new Tetrahedron( true ),                   // re-use it many times per call to display to get multiple cubes in the scene.
                       'windmill'        : new Windmill( 10 ) };
        this.submit_shapes( context, shapes );
        // *** Materials: *** Declare new ones as temps when needed; they're just cheap wrappers for some numbers.  1st parameter:  Color (4 floats in RGBA format),
        // 2nd: Ambient light, 3rd: Diffuse reflectivity, 4th: Specular reflectivity, 5th: Smoothness exponent, 6th: Optional texture object, leave off for un-textured.
        this.define_data_members( { purplePlastic: context.shaders_in_use["Phong_Model" ].material( Color( .9,.5,.9, 1 ), .4, .4, .8, 40 ),
                                    greyPlastic  : context.shaders_in_use["Phong_Model" ].material( Color( .5,.5,.5, 1 ), .4, .8, .4, 20 ),   // Smaller exponent means 
                                    blueGlass    : context.shaders_in_use["Phong_Model" ].material( Color( .5,.5, 1,.2 ), .4, .8, .4, 40 ),     // a bigger shiny spot.
                                    fire         : context.shaders_in_use["Funny_Shader"].material() } ); 
      },
    'display'( graphics_state )
      { var model_transform = identity();             // We have to reset model_transform every frame.
        
        // *** Lights: *** Values of vector or point lights over time.  Two different lights *per shape* supported; more requires changing a number in the vertex shader.
        graphics_state.lights = [ new Light( vec4(  30,  30,  34, 1 ), Color( 0, .4, 0, 1 ), 100000 ),      // Arguments to construct a Light(): Light source position or 
                                  new Light( vec4( -10, -20, -14, 0 ), Color( 1, 1, .3, 1 ), 100    ) ];    // vector (homogeneous coordinates), color, and size.  
        /**********************************
        Start coding down here!!!!
        **********************************/                                     // From here on down it's just some example shapes drawn 
                                                                                // for you -- freely replace them with your own!
        model_transform = mult( model_transform, translation( 0, 5, 0 ) );
        this.shapes.triangle       .draw( graphics_state, model_transform,                      this.purplePlastic );
        
        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        this.shapes.strip          .draw( graphics_state, model_transform,                      this.greyPlastic   );
        
        var t = graphics_state.animation_time/1000,   tilt_spin   = rotation( 700*t, [          .1,          .8,             .1 ] ),
                                                      funny_orbit = rotation(  90*t, [ Math.cos(t), Math.sin(t), .7*Math.cos(t) ] );

        // Many shapes can share influence from the same pair of lights, but they don't have to.  All the following shapes will use these lights instead of the above ones.
        graphics_state.lights = [ new Light( mult_vec( tilt_spin, vec4(  30,  30,  34, 1 ) ), Color( 0, .4, 0, 1 ), 100000               ),
                                  new Light( mult_vec( tilt_spin, vec4( -10, -20, -14, 0 ) ), Color( 1, 1, .3, 1 ), 100*Math.cos( t/10 ) ) ];
                                  
        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        this.shapes.tetrahedron    .draw( graphics_state, mult( model_transform, funny_orbit ), this.purplePlastic );
        
        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        this.shapes.bad_tetrahedron.draw( graphics_state, mult( model_transform, funny_orbit ), this.greyPlastic   );
        
        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        this.shapes.windmill       .draw( graphics_state, mult( model_transform, tilt_spin ),   this.purplePlastic );
        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        this.shapes.windmill       .draw( graphics_state, model_transform,                      this.fire          );
        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        this.shapes.windmill       .draw( graphics_state, model_transform,                      this.blueGlass     );
      }
  }, Scene_Component );  // End of class definition
  
  // *******************************************************************
  //  Assignment 1 would fit nicely into the following class definition:
  // define global var here
  var ballz = 0;  //all we are playing is this
  var bally = 2;
  var vy = 0;
  var vz = 0;
  var ttmp = 0;
  var fblock = 0;
  var bblock = 0;
  var walk = 0, jump = 0, fly = 0;
  var tut_alive = 1;
  var turz = -45;
  var turvz = -0.2;
  var marco_reversed = 0;
  var marco_alive = 1;
  var scene_controller = 0;
  var game_scene_t_begin = 0;
  var scream_played = 0;

  var temp_frame = 0, temp_t = 0, fps = 0;
Declare_Any_Class( "Bee_Scene",  // An example of drawing a hierarchical object using a "model_transform" matrix and post-multiplication.
  { 
        
    'construct'( context )
      { 
        this.globals    = context.globals;
        var shapes = {
                      "debug_text": new Text_Line( 35 ), 
                      "box" : new        Cube(),
                       "marco": new Shape_From_File("mario_obj.obj"), 
                       "ball": new Grid_Sphere( 10, 10 ),
                        "semi_sphere": new Semi_Sphere(10,10),
                        "cylinder": new Capped_Cylinder(10,10),
                       "pyramid": new Pentahedron() };

        this.submit_shapes( context, shapes );
        
        this.define_data_members( { yellow_clay: context.shaders_in_use["Phong_Model"].material( Color(  1,  1, .3, 1 ), .2, 1, .7, 40 ),
                                     brown_clay: context.shaders_in_use["Phong_Model"].material( Color( .5, .5, .3, 1 ), .2, 1,  1, 40 ),
                                  marco_skin: context.shaders_in_use["Phong_Model"  ].material( Color( .1,.1,.1,1 ), .5, .5, .5, 40, context.textures_in_use["marioD.jpg"]),
                                  brick: context.shaders_in_use["Phong_Model"  ].material( Color( .5,.5,.5,1 ), .5, .5, .5, 40, context.textures_in_use["brick.png"]),
                                  bgd: context.shaders_in_use["Phong_Model"  ].material( Color( .5,.5,.5,1 ), .5, .5, .5, 40, context.textures_in_use["bgd.jpg"]),
                                  mag: context.shaders_in_use["Phong_Model"  ].material( Color( .5,.5,.5,1 ), .5, .5, .5, 40, context.textures_in_use["mag.jpg"]),
                                  tut: context.shaders_in_use["Phong_Model"  ].material( Color( .5,.5,.5,1 ), .5, .5, .5, 40, context.textures_in_use["tut.jpg"]),
                                  dgreen: context.shaders_in_use["Phong_Model"  ].material( Color( .5,.5,.5,1 ), .5, .5, .5, 40, context.textures_in_use["dannygreen.jpg"]),
                                  translu: context.shaders_in_use["Phong_Model"  ].material( Color( .5,.5,.5,0.3 ), .5, .5, .5, 40, context.textures_in_use["title.jpg"]),   
                                  string_map:    context.globals.string_map, start_index: 0, tick: 0, visible: false, graphics_state: new Graphics_State(),
                                  text_material: context.shaders_in_use["Phong_Model"].material( 
                                                                                Color(  0, 0, 0, 1 ), 1, 0, 0, 40, context.textures_in_use["text.png"] ),
                                  gg: context.shaders_in_use["Phong_Model"  ].material( Color( .5,.5,.5,1 ), .5, .5, .5, 40, context.textures_in_use["gg.png"]),
                                  win: context.shaders_in_use["Phong_Model"  ].material( Color( .5,.5,.5,1 ), .5, .5, .5, 40, context.textures_in_use["win.png"]),
                                  crispy_chicken: context.shaders_in_use["Phong_Model"  ].material( Color( .5,.5,.5,1 ), .5, .5, .5, 40, context.textures_in_use["crispy.jpg"]),      
                                
                              
                            } );
      },

      'init_keys'( controls )   // init_keys():  Define any extra keyboard shortcuts here
      { 
        controls.add( "l", this, function() {  if(fblock==0) walk = 1; } ); controls.add( "l", this, function() { walk =  0; }, {'type':'keyup'});
        controls.add( "j", this, function() { if(bblock == 0) walk = -1; } ); controls.add( "j", this, function() { walk =  0; }, {'type':'keyup'});
        controls.add( "i", this, function() { if(fly==0)jump = 1;} ); 
        controls.add( "i", this, function() { jump =  0; }, {'type':'keyup'});
      },
    'display'( graphics_state )
      { 

        var a2 = document.getElementById("a2"); 
        a2.playbackRate = 1 ; 
        if(scene_controller == 3)
          a2.play();
        else
          a2.pause();
        var a1 = document.getElementById("a1"); 
        a1.playbackRate = 1 ; 
        if(scene_controller == 0)
          a1.play();
        else
          a1.pause();
        var doge = document.getElementById("doge"); 
        doge.playbackRate = 1 ; 
        if(scene_controller == 2)
          doge.play();
        else
          doge.pause();
        var cream = document.getElementById("cream"); 
        cream.playbackRate = 1 ; 
        if(scene_controller == 4 && scream_played == 0)
          {cream.play(); scream_played = 1;}

       

            // Assignment 1 can start here!
            var model_transform = identity();             // We have to reset model_transform every frame.
            var bgd_mt = identity();
            var tut_mt = identity();
        // *** Lights: *** Values of vector or point lights over time.  Two different lights *per shape* supported; more requires changing a number in the vertex shader.
        graphics_state.lights = [ new Light( vec4(  30,  30,  34, 1 ), Color( 0, .4, 0, 1 ), 100000 ),      // Arguments to construct a Light(): Light source position or 
                                  new Light( vec4( -10, -20, -14, 0 ), Color( 1, 1, .3, 1 ), 100    ) ];    // vector (homogeneous coordinates), color, and size.  
            
            
            var tt = graphics_state.animation_time/1000;

            //console.log(t);
            /*draw background (stable)*/
            this.draw_track(graphics_state, model_transform);

            bgd_mt = mult(bgd_mt, translation(-200, 0, 0));
            bgd_mt = mult(bgd_mt, scale(0.1, 400, 400));
            this.shapes.box.draw(graphics_state, bgd_mt, this.bgd);
            bgd_mt = identity();

            bgd_mt = mult(bgd_mt, translation(200, 0, 0));
            bgd_mt = mult(bgd_mt, scale(0.1, 400, 400));
            this.shapes.box.draw(graphics_state, bgd_mt, this.bgd);
            bgd_mt = identity();

            bgd_mt = mult(bgd_mt, translation(0, 0, -200));
            bgd_mt = mult(bgd_mt, scale(400, 400, 0.1));
            this.shapes.box.draw(graphics_state, bgd_mt, this.bgd);
            bgd_mt = identity();

            bgd_mt = mult(bgd_mt, translation(0, 0, 200));
            bgd_mt = mult(bgd_mt, scale(400, 400, 0.1));
            this.shapes.box.draw(graphics_state, bgd_mt, this.bgd);
            bgd_mt = identity();

            bgd_mt = mult(bgd_mt, translation(0, -200, 0));
            bgd_mt = mult(bgd_mt, scale(400, 0.1, 400));
            this.shapes.box.draw(graphics_state, bgd_mt, this.mag);
            bgd_mt = identity();
            bgd_mt = mult(bgd_mt, translation(0,0,-20));
            this.draw_chim(bgd_mt, graphics_state);
            bgd_mt = mult(bgd_mt, translation(0,0,-70));
            this.draw_chim(bgd_mt, graphics_state);


            /*end of stable stuff*/


            // title screen

            if(scene_controller == 0)
            {

              var title_mt = identity();
              title_mt = mult(title_mt, scale(30, 30, 0.1));
              title_mt = mult(title_mt, translation(0, 0, 25));
              this.shapes.box.draw(graphics_state, title_mt, this.translu);
              graphics_state.camera_transform = lookAt([0, 0, ballz+50], [0,3,ballz], [0,1,0]);

              var font_scale = scale( .02, .04, 1 );
              var txt_mt = identity();
              txt_mt = mult( txt_mt, font_scale );
              txt_mt = mult(txt_mt, scale(2,2,2));
              txt_mt = mult(txt_mt, translation(-10,4,0));
              strings = Object.keys( this.string_map );
              this.  shapes.debug_text.set_string( "Hyper Marco");
              this.  shapes.debug_text.draw( this.graphics_state, txt_mt, this.text_material );  // Draw some UI text
              txt_mt = mult(txt_mt, scale(.6,.6,.6));
              txt_mt = mult(txt_mt, translation(3, -8, 0));
              this.  shapes.debug_text.set_string( "version 1.0.0");
              this.  shapes.debug_text.draw( this.graphics_state, txt_mt, this.text_material );  // Draw some UI text
              if( tt > 0.1)
              {
                txt_mt = mult(txt_mt, translation(0, -14, 0));
                var percent = Math.round(tt)/20; 
                
                this.  shapes.debug_text.set_string( "Loading   " + percent*100 + " %");
                this.  shapes.debug_text.draw( this.graphics_state, txt_mt, this.text_material );
              }

              if(tt >= 0 && tt < 8)
              {
                var txt2_mt = identity();
                txt2_mt = mult(txt2_mt, scale(.02,.05,.03));
                txt2_mt = mult(txt2_mt, translation(-20,-6 , 2));
                this.  shapes.debug_text.set_string("Control: i: jump l: fwd j: bwd");
                this.  shapes.debug_text.draw( this.graphics_state, txt2_mt, this.text_material );
                this.  shapes.debug_text.set_string("Turn FPS on: t");
                this.  shapes.debug_text.draw( this.graphics_state, mult(txt2_mt, translation(0,-3,0)), this.text_material );
              }

              if(tt > 7 && tt < 14)
              {
                var txt2_mt = identity();
                txt2_mt = mult(txt2_mt, scale(.02,.05,.03));
                txt2_mt = mult(txt2_mt, translation(-20,-6 , 2));
                this.  shapes.debug_text.set_string("hints: when mario is killed");
                this.  shapes.debug_text.draw( this.graphics_state, txt2_mt, this.text_material );
                this.  shapes.debug_text.set_string("he will die");
                this.  shapes.debug_text.draw( this.graphics_state, mult(txt2_mt, translation(0,-3,0)), this.text_material );
              }

              if(tt > 14 && tt < 20)
              {
                var txt2_mt = identity();
                txt2_mt = mult(txt2_mt, scale(.02,.05,.03));
                txt2_mt = mult(txt2_mt, translation(-20,-6 , 2));
                this.  shapes.debug_text.set_string("hints: Every 60 Seconds In America,");
                this.  shapes.debug_text.draw( this.graphics_state, txt2_mt, this.text_material );
                this.  shapes.debug_text.set_string(" A Minute Passes");
                this.  shapes.debug_text.draw( this.graphics_state, mult(txt2_mt, translation(0,-3,0)), this.text_material );
                this.  shapes.debug_text.set_string(" Together we could stop this");
                this.  shapes.debug_text.draw( this.graphics_state, mult(txt2_mt, translation(0,-6,0)), this.text_material );
              }
              if(tt > 20)
              {
                scene_controller = 1;
                game_scene_t_begin = tt;
              }
            }


            if(scene_controller == 1)
            {
              var t = tt - game_scene_t_begin;
              graphics_state.camera_transform = lookAt([70*Math.cos(t/2),4,-50+70*Math.sin(t/2)], [0,0,-30], [0,1,0]);
              if(t >= 3.14)
              {
                scene_controller = 2;
                game_scene_t_begin = tt;
              }
            }

            if(scene_controller == 2)
            {
              var t = tt - game_scene_t_begin;
              graphics_state.camera_transform = lookAt([10, 10, ballz+20], [0,3,ballz], [0,1,0]);
              model_transform = identity();
              model_transform = mult(model_transform, translation(0,2,0));

              var txt_mt = identity();
              txt_mt = mult(txt_mt, translation(0, 0, 0));
              txt_mt = mult(txt_mt, scale(.5,.5,.5));
                if(Math.floor(t) == 0)
                  this.  shapes.debug_text.set_string( "3");
                else if(Math.floor(t) == 1)
                  this.  shapes.debug_text.set_string( "2");
                else if(Math.floor(t) == 2)
                  this.  shapes.debug_text.set_string( "1");
                if(t < 3)
                  this.  shapes.debug_text.draw( this.graphics_state, txt_mt, this.text_material );
                else
                {
                  model_transform = mult(model_transform, translation(0,20-t-1.2*t*t+3, 0));
                  if(20-t-1.2*t*t+3 <=1)
                  {
                    scene_controller = 3;
                    game_scene_t_begin = tt;
                  }
                }
              this.draw_ball(graphics_state, model_transform, t);

            }

            /*controller*/

            if(scene_controller == 3) // gaming scene
            {
              model_transform = identity();
              var block_height = new Array(67);
              var t = tt - game_scene_t_begin;
            var get_z_unit = function(ballz){return Math.floor(Math.abs(ballz/2)+0.8);}
            z_unit = get_z_unit(ballz);


            /*turtle controller*/

            if(Math.floor(t/3)%2 == 0)
            {turvz = -0.2;}
            else
              turvz = 0.2;
            if(t != 0)
              turz += turvz;
            tut_mt = mult(tut_mt, translation(0, 2, turz));
            
            /*end of tut ctrler*/
            if(Math.floor(t/3)%2 == 1)
            tut_mt = mult(tut_mt, rotation(180,0,1,0));

            for(var i = 0; i<block_height.length; i++ )
            {
              if(i==36)
                block_height[i] = 4; 
              else if(i == 35||i==36)
                block_height[i] =3;
              else if(i==34||i==35||i==36||i==63)
                block_height[i] = 2;
              else if(i == 33||i==34||i==35||i==36||i==40||i==62||i==63)
                block_height[i] = 1;                
              else if((i>=0&&i<=20)||(i>=23&&i<=33)||(i>=41&&i<=52)||(i>=54&&i<=61)||(i>=64))
                block_height[i] = 0;
              else
                block_height[i] = -1;
            } 

            block_height[10] = 2.5, block_height[45] = 2.5;

            if(walk == 1)
            {
              vz = 0.6;
            }
            else if (walk == -1)
            {
              vz = -0.6;
            }
            else
            {
              vz = 0;
            }

            if(jump == 1)
            {
              jump = 0;
              vy = 1;
              ttmp = t;
              fly = 1;
            }


            //landing
            if(bally-1-2*(block_height[get_z_unit(ballz)]+1)+1 <0 && block_height[get_z_unit(ballz)] != -1)
            {
              fly = 0;
              bally = 2*block_height[get_z_unit(ballz)] + 2;
              vy = 0;
              ttmp = 0
            }

            //free fall when drop

            if(bally-1- 2*(block_height[get_z_unit(ballz)]+1)+1> 0.1)
            {
              fly =1;
              if(ttmp == 0)
                ttmp = t;
            }
            //console.log(bally-1- 2*block_height[get_z_unit(ballz)]);

            // free fall when gap
            if(block_height[get_z_unit(ballz)] == -1)
            {
              fly = 1;
              if(ttmp ==0)
                ttmp = t;
              
            }

            //forward block
            if(block_height[get_z_unit(ballz)] == -1&&bally < -1)
            {
              fblock = 1;
              bblock = 1;
              scene_controller = 4;
            }
            else
            {
              fblock = 0;
              bblock = 0;
            }





            if(fly == 1)
            {
              vy -= 0.6*(t-ttmp);
            }
            else
            {
              vy = 0;
            }




            ballz -= vz;
            bally += vy;



            model_transform = mult(model_transform, translation(0, bally, ballz));

            if(vz < 0)
              marco_reversed = 1;
            if(vz > 0)
              marco_reversed = 0;
            if(marco_reversed == 1)
              model_transform = mult(model_transform, rotation(180, 0,1,0));
            z_unit = get_z_unit(ballz);

            var tut_z_unit = get_z_unit(turz);
            if(vy <0 && Math.abs(tut_z_unit-z_unit) <= 1 && bally < 3.5 && bally>2)
                tut_alive = 0;
            if(bally == 2 && Math.abs(tut_z_unit-z_unit) <= 1 && tut_alive == 1)
                marco_alive = 0;
            if(tut_alive == 1 && tut_z_unit == z_unit && bally == 2)
            {
              marco_alive = 0;
              scene_controller = 4;  
            }
            /*end of the controller*/
  

            if(get_z_unit(ballz) >65)
            {
              scene_controller = 5;
            }

            /* camra controller*/

            graphics_state.camera_transform = lookAt([10, 10, ballz+20], [0,3,ballz], [0,1,0]);
            this.draw_ball(graphics_state, model_transform, t);
            if(tut_alive == 1)
              this.draw_turtle(tut_mt, graphics_state, t);
            }
            /*end of the camera controller*/
            if(scene_controller == 4) //gg
            {
              var title_mt = identity();
              title_mt = mult(title_mt, scale(20, 20, 0.1));
              title_mt = mult(title_mt, translation(0, 0, 25));
              this.shapes.box.draw(graphics_state, title_mt, this.gg);
              graphics_state.camera_transform = lookAt([0, 0, 50], [0,3,0], [0,1,0]);
            }
            if(scene_controller == 5) //win
            {
              var title_mt = identity();
              title_mt = mult(title_mt, scale(20, 20, 0.1));
              title_mt = mult(title_mt, translation(0, 0, 25));
              this.shapes.box.draw(graphics_state, title_mt, this.win);
              graphics_state.camera_transform = lookAt([0, 0, 100], [0,3,0], [0,1,0]);
            }


      },

      'draw_ball'(graphics_state, model_transform, t)
      {
        model_transform = mult(model_transform, translation(0, 5,0));
        this.draw_indicator(model_transform, graphics_state, t);
        model_transform = mult(model_transform, translation(0,-5,0));
        model_transform = mult(model_transform, translation(0,1,0));
        model_transform = mult(model_transform, scale(1,1,1));
        model_transform = mult(model_transform, rotation(180, 0,1,0));
        this.shapes.marco.draw(graphics_state, model_transform, this.marco_skin);
      },
      'draw_track'(graphics_state, model_transform)
      {
        for(var i = 0; i<=66; i++)
        {
          //first level (basement)
          if(i != 21 && i!= 22&&i!=37&&i!=38&&i!=39&&i!=53&&i!=54)
            this.draw_box(graphics_state, model_transform, 0, i);
          //second level:
          if(i == 33||i==34||i==35||i==36||i==40||i==62||i==63)
            this.draw_box(graphics_state, model_transform, 1, i);
          //third
          if(i==34||i==35||i==36||i==63)
            this.draw_box(graphics_state, model_transform, 2, i);
          //fourth
          if(i == 35||i==36)
            this.draw_box(graphics_state, model_transform, 3, i);
          //fifth
          if(i == 36)
            this.draw_box(graphics_state, model_transform, 4, i);

        }
      },
      //get_coord
      'draw_box'(graphics_state, model_transform, y_coord, z_coord)
      {
        model_transform = mult(model_transform, translation(0, 2*y_coord, -2*z_coord));
        this.shapes.box.draw(graphics_state, model_transform, this.brick);
      },


      'draw_leg_segment' (model_transform, graphics_state, degree, per_segment_length, y, z)
      {
        model_transform = mult(model_transform, translation(0, y, z)); //put back
        model_transform = mult(model_transform, rotation(degree, [1,0,0]));//rotate
        model_transform = mult(model_transform, translation(0, -y, -z));//change the coord system (credit to prof's slides)
        model_transform = mult(model_transform, translation(0, -per_segment_length/2, 0));//not moving segment: align origin to its bottom

        model_transform = mult(model_transform, translation(0 ,y, z));

        model_transform = mult(model_transform, scale(.1,per_segment_length/2, .1)); //note that default length is 2

        this.shapes.box.draw(graphics_state, model_transform, this.brown_clay);
      },//ch

      'draw_lt_leg' (model_transform, graphics_state, t)
      {
        var per_segment_length = .3;
        var max_deg = 50;
        var period = 3;
        var theta = -Math.abs(max_deg*Math.sin(2*3.14/period*t));
        this.draw_leg_segment(model_transform, graphics_state, theta, per_segment_length, 0, 0); //upper_leg
        this.draw_leg_segment(model_transform, graphics_state, 2*theta, per_segment_length, -per_segment_length*Math.cos(theta*3.14/180), -per_segment_length*Math.sin(theta*3.14/180));
      },//ch

      'draw_tail' (model_transform, graphics_state, t)
      {
        var per_segment_length = .3;
        var max_deg = 50;
        var period = 3;
        var theta = -(max_deg*Math.sin(2*3.14/period*t));
        this.draw_leg_segment(model_transform, graphics_state, theta, per_segment_length, 0, 0); //upper_leg
        this.draw_leg_segment(model_transform, graphics_state, 2*theta, per_segment_length, -per_segment_length*Math.cos(theta*3.14/180), -per_segment_length*Math.sin(theta*3.14/180));
      },//ch
      'draw_sphere' (model_transform, graphics_state)
      {
        this.shapes.ball.draw(graphics_state, mult(model_transform, scale(0.5,0.5,0.5)), this.yellow_clay);
      },//ch


      'draw_turtle' (model_transform, graphics_state, t)
      {
        model_transform = mult(model_transform, translation(0,-0.5,0));
        this.draw_sphere(mult(model_transform, translation(0,0.5,-2)), graphics_state);
        this.shapes.semi_sphere.draw(graphics_state, mult(mult(model_transform,rotation(270,1,0,0)), scale(1,2,1)), this.tut);
        this.draw_lt_leg(mult(model_transform, translation(0.5,0,-0.8)), graphics_state, t);
        this.draw_lt_leg(mult(model_transform, translation(0.5,0,0.8)), graphics_state, t);

        this.draw_lt_leg(mult(model_transform, translation(-0.5,0,0.8)), graphics_state, t);
        this.draw_lt_leg(mult(model_transform, translation(-0.5,0,-0.8)), graphics_state, t);
        this.draw_tail(mult(mult(mult(model_transform, translation(0,0.14,1.8)), rotation(90,0,0,1)),rotation(270,1,0,0)), graphics_state, t);
      },
      'draw_chim' (model_transform, graphics_state)
      {
        model_transform = mult(model_transform, translation(0,3,0));
        model_transform = mult(model_transform, scale(1,4,1));
        model_transform = mult(model_transform, rotation(90,1,0,0));
        this.shapes.cylinder.draw(graphics_state, model_transform, this.dgreen);
        model_transform = mult(model_transform, scale(1.2,1.2,.25));
        model_transform = mult(model_transform, translation(0,0,-2.5));

        this.shapes.cylinder.draw(graphics_state, model_transform, this.dgreen);

      },
      'draw_indicator'(model_transform, graphics_state, t)
      {
        
        model_transform = mult(model_transform, scale(.4,.4,.4));
        model_transform = mult(model_transform,rotation(180,1,0,0));
        model_transform = mult(model_transform, rotation(100*t, 0,1,0));
        model_transform = mult(model_transform, translation(0,0,0));
        this.shapes.pyramid.draw(graphics_state, model_transform, this.crispy_chicken);
      },


      'update_strings'( luminosity_the_cat)   // Strings that this Scene_Component contributes to the UI:
      { 
        luminosity_the_cat.string_map["tick"]              = "Frame: " + this.tick++;
        var sec = Math.floor( this.globals.graphics_state.animation_time/1000);
        if(sec > temp_t)
        {
          fps = (this.tick - temp_frame);
          temp_t = sec;
          temp_frame = this.tick;
        }
        luminosity_the_cat.string_map["FPS"]            = "FPS: " + fps;
        luminosity_the_cat.string_map["a"]              = "temp_t: " + temp_t;
        luminosity_the_cat.string_map["b"]              = "temp_frame: " + temp_frame;

      }


  }, Scene_Component );

  
  // ******************************************************************
  // The rest of this file is more code that powers the included demos.

Declare_Any_Class( "Debug_Screen",  // Debug_Screen - An example of a Scene_Component that our Canvas_Manager can manage.  Displays a text user interface.
  { 'construct'( context )
      { this.define_data_members( { string_map:    context.globals.string_map, start_index: 0, tick: 0, visible: false, graphics_state: new Graphics_State(),
                                    text_material: context.shaders_in_use["Phong_Model"].material( 
                                                                                Color(  0, 0, 0, 1 ), 1, 0, 0, 40, context.textures_in_use["text.png"] ) } );
        var shapes = { 'debug_text': new Text_Line( 35 ),
                       'cube':   new Cube() };
        this.submit_shapes( context, shapes );
      },
    'init_keys'( controls )
      { controls.add( "t",    this, function() { this.visible ^= 1;                                                                                                  } );
        controls.add( "up",   this, function() { this.start_index = ( this.start_index + 1 ) % Object.keys( this.string_map ).length;                                } );
        controls.add( "down", this, function() 
                                    { this.start_index = ( this.start_index - 1   + Object.keys( this.string_map ).length ) % Object.keys( this.string_map ).length; } );
        this.controls = controls;
      },
    'update_strings'( debug_screen_object )   // Strings that this Scene_Component contributes to the UI:
      { debug_screen_object.string_map["tick"]              = "Frame: " + this.tick++;
        debug_screen_object.string_map["text_scroll_index"] = "Text scroll index: " + this.start_index;
      },
    'display'( global_graphics_state )    // Leave these 3D global matrices unused, because this class is instead making a 2D user interface.
      { if( !this.visible ) return;
        var font_scale = scale( .02, .04, 1 ),
            model_transform = mult( translation( -.95, -.9, 0 ), font_scale ),
            strings = Object.keys( this.string_map );
  
        for( var i = 0, idx = this.start_index; i < 4 && i < strings.length; i++, idx = (idx + 1) % strings.length )
        { this.shapes.debug_text.set_string( this.string_map[ strings[idx] ] );
          this.shapes.debug_text.draw( this.graphics_state, model_transform, this.text_material );  // Draw some UI text (each live-updated 
          model_transform = mult( translation( 0, .08, 0 ), model_transform );                      // logged value in each Scene_Component)
        }
        model_transform   = mult( translation( .7, .9, 0 ), font_scale );
        this.  shapes.debug_text.set_string( "Controls:" );
        this.  shapes.debug_text.draw( this.graphics_state, model_transform, this.text_material );  // Draw some UI text

        for( let k of Object.keys( this.controls.all_shortcuts ) )
        { model_transform = mult( translation( 0, -0.08, 0 ), model_transform );
          this.shapes.debug_text.set_string( k );
          this.shapes.debug_text.draw( this.graphics_state, model_transform, this.text_material );  // Draw some UI text (the canvas's key controls)
        }
      }
  }, Scene_Component );

Declare_Any_Class( "Example_Camera",                  // An example of a Scene_Component that our Canvas_Manager can manage.  Adds both first-person and
  { 'construct'( context, canvas = context.canvas )   // third-person style camera matrix controls to the canvas.
      { // 1st parameter below is our starting camera matrix.  2nd is the projection:  The matrix that determines how depth is treated.  It projects 3D points onto a plane.
        context.globals.graphics_state.set( translation(0, 0,-25), perspective(45, context.width/context.height, .1, 1000), 0 );
        this.define_data_members( { graphics_state: context.globals.graphics_state, thrust: vec3(), origin: vec3( 0, 5, 0 ), looking: false } );

        // *** Mouse controls: ***
        this.mouse = { "from_center": vec2() };                           // Measure mouse steering, for rotating the flyaround camera:
        var mouse_position = function( e ) { return vec2( e.clientX - context.width/2, e.clientY - context.height/2 ); };   
        canvas.addEventListener( "mouseup",   ( function(self) { return function(e) 
                                                                      { e = e || window.event;    self.mouse.anchor = undefined;              } } ) (this), false );
        canvas.addEventListener( "mousedown", ( function(self) { return function(e) 
                                                                      { e = e || window.event;    self.mouse.anchor = mouse_position(e);      } } ) (this), false );
        canvas.addEventListener( "mousemove", ( function(self) { return function(e) 
                                                                      { e = e || window.event;    self.mouse.from_center = mouse_position(e); } } ) (this), false );
        canvas.addEventListener( "mouseout",  ( function(self) { return function(e) { self.mouse.from_center = vec2(); }; } ) (this), false );  // Stop steering if the 
      },                                                                                                                                        // mouse leaves the canvas.
    'init_keys'( controls )   // init_keys():  Define any extra keyboard shortcuts here
      { controls.add( "Space", this, function() { this.thrust[1] = -1; } );     controls.add( "Space", this, function() { this.thrust[1] =  0; }, {'type':'keyup'} );
        controls.add( "z",     this, function() { this.thrust[1] =  1; } );     controls.add( "z",     this, function() { this.thrust[1] =  0; }, {'type':'keyup'} );
        controls.add( "w",     this, function() { this.thrust[2] =  1; } );     controls.add( "w",     this, function() { this.thrust[2] =  0; }, {'type':'keyup'} );
        controls.add( "a",     this, function() { this.thrust[0] =  1; } );     controls.add( "a",     this, function() { this.thrust[0] =  0; }, {'type':'keyup'} );
        controls.add( "s",     this, function() { this.thrust[2] = -1; } );     controls.add( "s",     this, function() { this.thrust[2] =  0; }, {'type':'keyup'} );
        controls.add( "d",     this, function() { this.thrust[0] = -1; } );     controls.add( "d",     this, function() { this.thrust[0] =  0; }, {'type':'keyup'} );
        controls.add( ",",     this, function() { this.graphics_state.camera_transform = mult( rotation( 6, 0, 0,  1 ), this.graphics_state.camera_transform ); } );
        controls.add( ".",     this, function() { this.graphics_state.camera_transform = mult( rotation( 6, 0, 0, -1 ), this.graphics_state.camera_transform ); } );
        controls.add( "o",     this, function() { this.origin = mult_vec( inverse( this.graphics_state.camera_transform ), vec4(0,0,0,1) ).slice(0,3)         ; } );
        controls.add( "r",     this, function() { this.graphics_state.camera_transform = identity()                                                           ; } );
        controls.add( "f",     this, function() { this.looking  ^=  1; } );
      },
    'update_strings'( user_interface_string_manager )   // Strings that this Scene_Component contributes to the UI:
      { var C_inv = inverse( this.graphics_state.camera_transform ), pos = mult_vec( C_inv, vec4( 0, 0, 0, 1 ) ),
                                                                  z_axis = mult_vec( C_inv, vec4( 0, 0, 1, 0 ) );
        user_interface_string_manager.string_map["origin" ] = "Center of rotation: " 
                                                              + this.origin[0].toFixed(0) + ", " + this.origin[1].toFixed(0) + ", " + this.origin[2].toFixed(0);
        user_interface_string_manager.string_map["cam_pos"] = "Cam Position: "
                                                              + pos[0].toFixed(2) + ", " + pos[1].toFixed(2) + ", " + pos[2].toFixed(2);    
        user_interface_string_manager.string_map["facing" ] = "Facing: " + ( ( z_axis[0] > 0 ? "West " : "East ")             // (Actually affected by the left hand rule)
                                                               + ( z_axis[1] > 0 ? "Down " : "Up " ) + ( z_axis[2] > 0 ? "North" : "South" ) );
      },
    'display'( graphics_state )
      { var leeway = 70,  degrees_per_frame = .0004 * graphics_state.animation_delta_time,
                          meters_per_frame  =   .01 * graphics_state.animation_delta_time;
        if( this.mouse.anchor )                                                         // Third-person "arcball" camera mode: Is a mouse drag occurring?
        { var dragging_vector = subtract( this.mouse.from_center, this.mouse.anchor );  // Spin the scene around the world origin on a user-determined axis.
          if( length( dragging_vector ) > 0 )
            graphics_state.camera_transform = mult( graphics_state.camera_transform,    // Post-multiply so we rotate the scene instead of the camera.
                mult( translation( this.origin ),
                mult( rotation( .05 * length( dragging_vector ), dragging_vector[1], dragging_vector[0], 0 ),
                      translation(scale_vec( -1, this.origin ) ) ) ) );
        }
        // First-person flyaround mode:  Determine camera rotation movement when the mouse is past a minimum distance (leeway) from the canvas's center.
        var offsets = { plus:  [ this.mouse.from_center[0] + leeway, this.mouse.from_center[1] + leeway ],
                        minus: [ this.mouse.from_center[0] - leeway, this.mouse.from_center[1] - leeway ] };
        if( this.looking ) 
          for( var i = 0; i < 2; i++ )      // Steer according to "mouse_from_center" vector, but don't start increasing until outside a leeway window from the center.
          { var velocity = ( ( offsets.minus[i] > 0 && offsets.minus[i] ) || ( offsets.plus[i] < 0 && offsets.plus[i] ) ) * degrees_per_frame;  // &&'s might zero these out.
            graphics_state.camera_transform = mult( rotation( velocity, i, 1-i, 0 ), graphics_state.camera_transform );   // On X step, rotate around Y axis, and vice versa.
          }     // Now apply translation movement of the camera, in the newest local coordinate frame
        graphics_state.camera_transform = mult( translation( scale_vec( meters_per_frame, this.thrust ) ), graphics_state.camera_transform );
      }
  }, Scene_Component );

Declare_Any_Class( "Flag_Toggler",  // A class that just interacts with the keyboard and reports strings
  { 'construct'( context ) { this.globals    = context.globals; },
    'init_keys'( controls )   //  Desired keyboard shortcuts
      { controls.add( "ALT+g", this, function() { this.globals.graphics_state.gouraud       ^= 1; } );   // Make the keyboard toggle some
        controls.add( "ALT+n", this, function() { this.globals.graphics_state.color_normals ^= 1; } );   // GPU flags on and off.
        controls.add( "ALT+a", this, function() { this.globals.animate                      ^= 1; } );
      },
    'update_strings'( user_interface_string_manager )   // Strings that this Scene_Component contributes to the UI:
      { user_interface_string_manager.string_map["time"]    = "Animation Time: " + Math.round( this.globals.graphics_state.animation_time )/1000 + "s";
        user_interface_string_manager.string_map["animate"] = "Animation " + (this.globals.animate ? "on" : "off") ;
      },
  }, Scene_Component );
  
Declare_Any_Class( "Surfaces_Tester",
  { 'construct'( context )
      { context.globals.animate = true;
        var shapes = { 'good_sphere' : new Subdivision_Sphere( 4 ),
                       'box'         : new Cube(),
                       'strip'       : new Square(),
                       'septagon'    : new Regular_2D_Polygon(  2,  7 ),
                       'tube'        : new Cylindrical_Tube  ( 10, 10 ),
                       'open_cone'   : new Cone_Tip          (  3, 10 ),
                       'donut'       : new Torus             ( 15, 15 ),
                       'bad_sphere'  : new Grid_Sphere       ( 10, 10 ),
                       'cone'        : new Closed_Cone       ( 10, 10 ),
                       'capped'      : new Capped_Cylinder   (  4, 12 ),
                       'axis'        : new Axis_Arrows(),
                       'prism'       :     Capped_Cylinder   .prototype.auto_flat_shaded_version( 10, 10 ),
                       'gem'         :     Subdivision_Sphere.prototype.auto_flat_shaded_version(  2     ),
                       'gem2'        :     Torus             .prototype.auto_flat_shaded_version( 20, 20 ),
                       'swept_curve' : new Surface_Of_Revolution( 10, 10, 
                                            [ vec3( 2, 0, -1 ), vec3( 1, 0, 0 ), vec3( 1, 0, 1 ), vec3( 0, 0, 2 ) ], 120, [ [ 0, 7 ] [ 0, 7 ] ] ) 
                     };
        this.submit_shapes( context, shapes );
        this.define_data_members( { shader: context.shaders_in_use["Phong_Model"], textures: Object.values( context.textures_in_use ) } );
      },
    'draw_all_shapes'( model_transform, graphics_state )
      { var i = 0, t = graphics_state.animation_time / 1000;
        
        for( key in this.shapes )
        { i++;
          var funny_function_of_time = 50*t + i*i*Math.cos( t/2 ),
              random_material        = this.shader.material( Color( (i % 7)/7, (i % 6)/6, (i % 5)/5, 1 ), .2, 1, 1, 40, this.textures[ i % this.textures.length ] )
              
          model_transform = mult( model_transform, rotation( funny_function_of_time, i%3 == 0, i%3 == 1, i%3 == 2 ) );   // Irregular motion
          model_transform = mult( model_transform, translation( 0, -3, 0 ) );
          this.shapes[ key ].draw( graphics_state, model_transform, random_material );        //  Draw the current shape in the list    
        }
        return model_transform;     
      },
    'display'( graphics_state )
      { var model_transform = identity(); 
        for( var i = 0; i < 7; i++ )                                    // Another example of not every shape owning the same pair of lights:
        { graphics_state.lights = [ new Light( vec4( i % 7 - 3, i % 6 - 3, i % 5 - 3, 1 ), Color( 1, 0, 0, 1 ), 100000000 ),
                                    new Light( vec4( i % 6 - 3, i % 5 - 3, i % 7 - 3, 1 ), Color( 0, 1, 0, 1 ), 100000000 ) ];
        
          model_transform = this.draw_all_shapes( model_transform, graphics_state );      // *** How to call a function and still have a single matrix state ***
          model_transform = mult( model_transform, rotation( 360 / 13, 0, 0, 1 ) );
        }
      }
  }, Scene_Component );
  
Declare_Any_Class( "Star",    // An example of animating without making any extremely customized primitives.
  { 'construct'( context )    // Each frame manages to show one million points connected by half as many flat-colored triangles.
      { context.globals.animate = true;
        context.globals.graphics_state.animation_time = 90000;
        this.shader = context.shaders_in_use["Phong_Model"];
        var shapes = { "torus": Torus.prototype.auto_flat_shaded_version( 25, 25 ) };
        shapes.torus.indexed = false;             // Just to additionally test non-indexed shapes somewhere, use the fact that in this 
        this.submit_shapes( context, shapes );    // flat-shaded shape (no shared vertices) the index list is redundant.
      },
    'display'( graphics_state )
      { var t = graphics_state.animation_time/500,   funny_orbit = rotation(  90*t, [ Math.cos(t), Math.sin(t), .7*Math.cos(t) ] );
        graphics_state.lights = [ new Light( mult_vec( funny_orbit, vec4(  30,  30,  34, 1 ) ), Color( 0, .4, 0, 1 ), 100000               ),
                                  new Light( mult_vec( funny_orbit, vec4( -10, -20, -14, 0 ) ), Color( 1, 1, .3, 1 ), 100*Math.cos( t/10 ) ) ];
        for( var j = 0; j < 20; j++ )
          for( var i = 0; i < 20; i++ )
          {            
            var model_transform =                        rotation   ( j * 18 *                  t/60  , 0, 0, 1   );
                model_transform = mult( model_transform, rotation   ( i * 18 * Math.sin(        t/21 ), 0, 1, 0 ) );
                model_transform = mult( model_transform, translation( 2 * i  * Math.sin(        t/31 ), 0, 0    ) );
                model_transform = mult( model_transform, scale      ( 1,  1  + Math.sin( i*18 * t/41 ), 1       ) );
            
            this.shapes.torus.draw( graphics_state, model_transform, this.shader.material( Color( i/10, j/20, 0, 1 ), .2, .8, .5, 20 ) );
          }
      }
  }, Scene_Component );

Declare_Any_Class( "Bump_Map_And_Mesh_Loader",     // An example where one teapot has a bump-mapping-like hack, and the other does not.
  { 'construct'( context )
      { context.globals.animate = true;
        context.globals.graphics_state.camera_transform = translation( 0, 0, -5 );
      
        var shapes = { "teapot": new Shape_From_File( "teapot.obj" ) };
        this.submit_shapes( context, shapes );
        this.define_data_members( { stars: context.shaders_in_use["Phong_Model"  ].material( Color( .5,.5,.5,1 ), .5, .5, .5, 40, context.textures_in_use["stars.png"] ),
                                    bumps: context.shaders_in_use["Fake_Bump_Map"].material( Color( .5,.5,.5,1 ), .5, .5, .5, 40, context.textures_in_use["stars.png"] )});
      },
    'display'( graphics_state )
      { var t = graphics_state.animation_time;
        graphics_state.lights = [ new Light( mult_vec( rotation( t/5, 1, 0, 0 ), vec4(  3,  2,  10, 1 ) ), Color( 1, .7, .7, 1 ), 100000 ) ];
        
        for( let i of [ -1, 1 ] )
        { var model_transform = mult( rotation( t/40, 0, 2, 1 ), translation( 2*i, 0, 0 ) );
              model_transform = mult( model_transform, rotation( t/25, -1, 2, 0 ) );
          this.shapes.teapot.draw( graphics_state, mult( model_transform, rotation( -90, 1, 0, 0 ) ), i == 1 ? this.stars : this.bumps );
        }
      }
  }, Scene_Component );
  
  
  // DISCLAIMER:  The collision method shown below is not used by anyone; it's just very quick to code.  Making every collision body a stretched sphere is kind 
  // of a hack, and looping through a list of discrete sphere points to see if the volumes intersect is *really* a hack (there are perfectly good analytic 
  // expressions that can test if two ellipsoids intersect without discretizing them into points).   On the other hand, for non-convex shapes you're usually going
  // to have to loop through a list of discrete tetrahedrons defining the shape anyway.
Declare_Any_Class( "Body",
  { 'construct'(s, m) { this.randomize(s, m); },
    'randomize'(s, m)
      { this.define_data_members( { shape: s, scale: [1, 1+Math.random(), 1],
                                    location_matrix: mult( rotation( 360 * Math.random(), random_vec3(1) ), translation( random_vec3(10) ) ), 
                                    linear_velocity: random_vec3(.1), 
                                    angular_velocity: .5*Math.random(), spin_axis: random_vec3(1),
                                    material: m } )
      },
    'advance'( b, time_amount )   // Do one timestep.
      { var delta = translation( scale_vec( time_amount, b.linear_velocity ) );  // Move proportionally to real time.
        b.location_matrix = mult( delta, b.location_matrix );                    // Apply translation velocity - pre-multiply to keep translations together
        
        delta = rotation( time_amount * b.angular_velocity, b.spin_axis );       // Move proportionally to real time.
        b.location_matrix = mult( b.location_matrix, delta );                    // Apply angular velocity - post-multiply to keep rotations together    
      },
    'check_if_colliding'( b, a_inv, shape )   // Collision detection function
      { if ( this == b ) return false;        // Nothing collides with itself
        var T = mult( a_inv, mult( b.location_matrix, scale( b.scale ) ) );  // Convert sphere b to a coordinate frame where a is a unit sphere
        for( let p of shape.positions )                                      // For each vertex in that b,
        { var Tp = mult_vec( T, p.concat(1) ).slice(0,3);                    // Apply a_inv*b coordinate frame shift
          if( dot( Tp, Tp ) < 1.2 )   return true;     // Check if in that coordinate frame it penetrates the unit sphere at the origin.     
        }
        return false;
      }
  });
  
Declare_Any_Class( "Simulation_Scene_Superclass",
  { 'construct'( context )
      { context.globals.animate = true;
        this.define_data_members( { bodies: [], shader: context.shaders_in_use["Phong_Model"], stars: context.textures_in_use["stars.png"] } );
        
        var shapes = { "donut"       : new Torus( 15, 15 ),
                       "cone"        : new Closed_Cone( 10, 10 ),
                       "capped"      : new Capped_Cylinder( 4, 12 ),
                       "axis"        : new Axis_Arrows(),
                       "prism"       :     Capped_Cylinder   .prototype.auto_flat_shaded_version( 10, 10 ),
                       "gem"         :     Subdivision_Sphere.prototype.auto_flat_shaded_version( 2 ),
                       "gem2"        :     Torus             .prototype.auto_flat_shaded_version( 20, 20 ) };
        this.submit_shapes( context, shapes );
      },
    'random_shape'() { return Object.values( this.shapes )[ Math.floor( 7*Math.random() ) ] },
    'random_material'() { return this.shader.material( Color( 1,Math.random(),Math.random(),1 ), .1, 1, 1, 40, this.stars ) },
    'display'( graphics_state )
      { graphics_state.lights = [ new Light( vec4(5,1,1,0), Color( 1, 1, 1, 1 ), 10000 ) ];
                                              
        if( Math.random() < .02 ) this.bodies.splice( 0, this.bodies.length/4 ); // Sometimes we delete some so they can re-generate as new ones
        for( let b of this.bodies )
        { b.shape.draw( graphics_state, mult( b.location_matrix, scale( b.scale ) ), b.material ); // Draw each shape at its current location 
          b.advance( b, graphics_state.animation_delta_time );
        }
        this.simulate();    // This is an abstract class; call the subclass's version
      },
  }, Scene_Component );

Declare_Any_Class( "Ground_Collision_Scene",    // Scenario 1: Let random initial momentums carry bodies until they fall and bounce.
  { 'simulate'()
      { while( this.bodies.length < 100 )   this.bodies.push( new Body(this.random_shape(), this.random_material()) );      // Generate moving bodies  
        for( let b of this.bodies )
        { b.linear_velocity[1] += .0001 * -9.8;       // Gravity.
          if( b.location_matrix[1][3] < -4 && b.linear_velocity[1] < 0 ) b.linear_velocity[1] *= -.8;   // If about to fall through floor, reverse y velocity.     
        }
      }
  }, Simulation_Scene_Superclass );
 
Declare_Any_Class( "Object_Collision_Scene",    // Scenario 2: Detect when some flying objects collide with one another, coloring them red.    
  { 'simulate'()
      { if   ( this.bodies.length > 20 )       this.bodies = this.bodies.splice( 0, 20 );                                   // Max of 20 bodies
        while( this.bodies.length < 20 )       this.bodies.push( new Body(this.random_shape(), this.random_material()) );   // Generate moving bodies  
        
        if( ! this.collider ) this.collider = new Subdivision_Sphere(1);      // The collision shape should be simple
        
        for( let b of this.bodies )
        { var b_inv = inverse( mult( b.location_matrix, scale( b.scale ) ) );               // Cache b's final transform
          
          var center = mult_vec( b.location_matrix, vec4( 0, 0, 0, 1 ) ).slice(0,3);        // Center of the body
          b.linear_velocity = subtract( b.linear_velocity, scale_vec( .0003, center ) );    // Apply a small centripetal force to everything
          b.material = this.shader.material( Color( 1,1,1,1 ), .1, 1, 1, 40, this.stars );              // Default color: white
         
          for( let c of this.bodies )                                      // Collision process starts here
            if( b.check_if_colliding( c, b_inv, this.collider ) )          // Send the two bodies and the collision shape
            { b.material = this.shader.material( Color( 1,0,0,1 ), .1, 1, 1, 40, this.stars );        // If we get here, we collided, so turn red
              b.linear_velocity  = vec3();                                 // Zero out the velocity so they don't inter-penetrate more
              b.angular_velocity = 0;
            }   
        }   
      }
  }, Simulation_Scene_Superclass );