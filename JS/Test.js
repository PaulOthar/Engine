let Current_Screen = new Screen('canvas');

Current_Screen.Config_CanvasPixels(600,600);

Current_Screen.Set_LineStyle('white',1,false,false);

let Engine = new EngineRunner(Current_Screen.Width,Current_Screen.Height,90,0.1,1000);


Engine.Camera.Position.x = 0;
Engine.Camera.Position.y = 5;
Engine.Camera.Position.z = 0;
/*
Engine.Camera.Look_Step = 180;
Engine.Camera.Look_Leftward();
Engine.Camera.Calculate_LookMatrix();
*/

function MakeCube(x,y,z,id){
    let Cube = new Mesh(0,x,y,z);

    Cube.AddSpaceVector(0,0,0,1);
    Cube.AddSpaceVector(1,0,0,2);
    Cube.AddSpaceVector(0,1,0,3);
    Cube.AddSpaceVector(0,0,1,4);
    Cube.AddSpaceVector(1,1,0,5);
    Cube.AddSpaceVector(0,1,1,6);
    Cube.AddSpaceVector(1,0,1,7);
    Cube.AddSpaceVector(1,1,1,8);
    
    Cube.AddTextureVector(16,0,1);
    Cube.AddTextureVector(31,0,2);
    Cube.AddTextureVector(16,15,3);
    Cube.AddTextureVector(31,15,4);
    
    //SOUTH
    Cube.AddConnectionTriangle(1,3,5,1,3,4,1);
    Cube.AddConnectionTriangle(1,5,2,1,4,2,2);
    
    //EAST
    Cube.AddConnectionTriangle(2,5,8,1,3,4,3);
    Cube.AddConnectionTriangle(2,8,7,1,4,2,4);
    
    //NORTH
    Cube.AddConnectionTriangle(7,8,6,1,3,4,5);
    Cube.AddConnectionTriangle(7,6,4,1,4,2,6);
    
    //WEST
    Cube.AddConnectionTriangle(4,6,3,1,3,4,7);
    Cube.AddConnectionTriangle(4,3,1,1,4,2,8);
    
    //TOP
    Cube.AddConnectionTriangle(3,6,8,1,3,4,9);
    Cube.AddConnectionTriangle(3,8,5,1,4,2,10);
    
    //BOTTOM
    Cube.AddConnectionTriangle(7,4,1,1,3,4,11);
    Cube.AddConnectionTriangle(7,1,2,1,4,2,12);
    
    Cube.Initialize();

    Cube.ImageData = id;

    return Cube;
}

let House = new Mesh(0,0,0,5);

//Floor
House.AddSpaceVector(10,0,20,1);
House.AddSpaceVector(-10,0,20,2);
House.AddSpaceVector(10,0,0,3);
House.AddSpaceVector(-10,0,0,4);

//Wall Front
House.AddSpaceVector(5,7,5,5);
House.AddSpaceVector(-5,7,5,6);
House.AddSpaceVector(5,0,5,7);
House.AddSpaceVector(-5,0,5,8);
//Wall Triangle Front
House.AddSpaceVector(0,7,5,9);
House.AddSpaceVector(0,10,5,10);

//Wall Back
House.AddSpaceVector(5,7,15,11);
House.AddSpaceVector(-5,7,15,12);
House.AddSpaceVector(5,0,15,13);
House.AddSpaceVector(-5,0,15,14);
//Wall Triangle Back
House.AddSpaceVector(0,7,15,15);
House.AddSpaceVector(0,10,15,16);

//Floor
House.AddConnectionTriangle(1,3,4,1,3,4,1);
House.AddConnectionTriangle(1,4,2,1,4,2,2);

//Wall Front
House.AddConnectionTriangle(5,7,8,5,7,8,1);
House.AddConnectionTriangle(5,8,6,5,8,6,2);
//Wall Triangle Front
House.AddConnectionTriangle(5,9,10,5,11,9,1);
House.AddConnectionTriangle(10,9,6,10,12,6,2);

//Wall Back
House.AddConnectionTriangle(11,14,13,5,8,7,1);
House.AddConnectionTriangle(11,12,14,5,6,8,2);
//Wall Triangle Back
House.AddConnectionTriangle(11,16,15,5,9,11,1);
House.AddConnectionTriangle(16,12,15,10,6,12,2);

//Wall Left
House.AddConnectionTriangle(11,13,7,5,7,8,1);
House.AddConnectionTriangle(11,7,5,5,8,6,2);

//Wall Right
House.AddConnectionTriangle(12,8,14,5,8,7,1);
House.AddConnectionTriangle(12,6,8,5,6,8,2);

//Roof Left
House.AddConnectionTriangle(10,11,5,13,16,14,1);
House.AddConnectionTriangle(10,16,11,13,15,16,2);

//Right
House.AddConnectionTriangle(16,6,12,13,16,14,1);
House.AddConnectionTriangle(16,10,6,13,15,16,2);

//Grass
House.AddTextureVector(0,0,1);
House.AddTextureVector(15,0,2);
House.AddTextureVector(0,15,3);
House.AddTextureVector(15,15,4);

//Plank
House.AddTextureVector(16,6,5);
House.AddTextureVector(31,6,6);
House.AddTextureVector(16,15,7);
House.AddTextureVector(31,15,8);
//Plank Triangle
House.AddTextureVector(23,0,9);
House.AddTextureVector(24,0,10);
House.AddTextureVector(23,6,11);
House.AddTextureVector(24,6,12);

//Brick
House.AddTextureVector(0,16,13);
House.AddTextureVector(15,16,14);
House.AddTextureVector(0,31,15);
House.AddTextureVector(15,31,16);

House.Initialize();

//let URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAIAAAAmzuBxAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAxSURBVChTYyAK/McN0FVA2GgiIADlEaMCEyBUQEhkABcHAQQLFaCowAWoqAIfYGAAAEhByzW0Xq4RAAAAAElFTkSuQmCC";
//let URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAB5SURBVChTY6yvr//PQCRgAREuLi4Mtra2YIHDhw+DaRBAFtuzZw8DE5gHBDBFMAXYNMMVgwBI4q2MCpgNopEVggCKYkIAQ/G15fNRaGQAVwxzIzpAFgeHBgzg0gADKKHx//9/MEZnwwCKm48cOQJlQQA6n4QYZGAAAHdNOMHvsjQJAAAAAElFTkSuQmCC";

//Minecraft Texture:
let URL = 'data:image/png;base64,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';
let Img = new Image();


Img.onload = function(){
    Current_Screen.Context.drawImage(Img,0,0);
    let ImgD = Current_Screen.Context.getImageData(0,0,Img.width,Img.height);

    House.ImageData = ImgD;
    Engine.Mesh_List.push(House);

    Engine.Mesh_List.push(MakeCube(0,0,5,ImgD));
}

Img.src = URL;
let StartingTime = Date.now();
let Datethen = 0;
let Difference = 0;
let FPS = 0;
let Lowest = 1000;
let Hightest = 0;
let Medium = 0;
let Med = new Array(10).fill(0);
let ElapsedTime = StartingTime;
function Run(){
    Difference = Date.now() - Datethen;
    Datethen = Date.now();
    FPS = Math.round(1000/Difference);
    Med.push(FPS);
    Med.splice(0,1);
    Medium = (Med[0]+Med[1]+Med[2]+Med[3]+Med[4]+Med[5]+Med[6]+Med[7]+Med[8]+Med[9])/10;
    ElapsedTime = (Datethen - StartingTime)/1000

    Showoff(1/2);
    
    Engine.Camera.Calculate_LookMatrix();
    Engine.Run_Cycle();
    Current_Screen.Context.putImageData(Engine.Texture_Handler.Current_Output.ImageData,0,0);

    if(ElapsedTime % 10 < 1){
        Lowest = Medium;
        Hightest = Medium;
    }

    if(Medium < Lowest && Medium > 1){
        Lowest = Medium;
    }
    if(Medium > Hightest && Medium < 500){
        Hightest = Medium;
    }
    Current_Screen.Draw_Text(`FPS: ${FPS} / Lowest : ${Lowest} / Hightest : ${Hightest} / Medium : ${Medium} / Elapsed : ${ElapsedTime} / Triangle Count : ${Engine.TriangleCount}`,10,10);
}

function Showoff(Distance){
    Engine.Camera.Walk_Step = Distance;
    Engine.Camera.Look_Leftward();
    Engine.Camera.Calculate_LookMatrix();
    Engine.Camera.Calculate_BasicMovementDirection();
    Engine.Camera.Move_Leftward();
}