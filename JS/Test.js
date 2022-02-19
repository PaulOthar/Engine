let Current_Screen = new Screen('canvas');

Current_Screen.Config_CanvasPixels(600,600);

Current_Screen.Set_LineStyle('white',1,false,false);

let Engine = new EngineRunner(Current_Screen.Width,Current_Screen.Height,90,0.1,1000);

Engine.Camera.Position.x = -1;
Engine.Camera.Position.y = 2.5;
Engine.Camera.Position.z = 3;

Engine.Camera.Look_Step = 30;
Engine.Camera.Look_Leftward();
Engine.Camera.Calculate_LookMatrix();

let Cube = new Mesh(0,0,0,5);

Cube.AddSpaceVector(0,0,0,1);
Cube.AddSpaceVector(1,0,0,2);
Cube.AddSpaceVector(0,1,0,3);
Cube.AddSpaceVector(0,0,1,4);
Cube.AddSpaceVector(1,1,0,5);
Cube.AddSpaceVector(0,1,1,6);
Cube.AddSpaceVector(1,0,1,7);
Cube.AddSpaceVector(1,1,1,8);

Cube.AddTextureVector(0,0,1);
Cube.AddTextureVector(10,0,2);
Cube.AddTextureVector(0,10,3);
Cube.AddTextureVector(10,10,4);

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

//let URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAIAAAAmzuBxAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAxSURBVChTYyAK/McN0FVA2GgiIADlEaMCEyBUQEhkABcHAQQLFaCowAWoqAIfYGAAAEhByzW0Xq4RAAAAAElFTkSuQmCC";
let URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAB5SURBVChTY6yvr//PQCRgAREuLi4Mtra2YIHDhw+DaRBAFtuzZw8DE5gHBDBFMAXYNMMVgwBI4q2MCpgNopEVggCKYkIAQ/G15fNRaGQAVwxzIzpAFgeHBgzg0gADKKHx//9/MEZnwwCKm48cOQJlQQA6n4QYZGAAAHdNOMHvsjQJAAAAAElFTkSuQmCC";
let Img = new Image();
Img.src = URL;

Img.onload = function(){
    Current_Screen.Context.drawImage(Img,0,0);
    let ImgD = Current_Screen.Context.getImageData(0,0,Img.width,Img.height);
    Cube.ImageData = ImgD;
    Engine.Mesh_List.push(Cube);

    Engine.Run_Cycle();

    console.log("Loaded");
    Current_Screen.Context.putImageData(Engine.Texture_Handler.Current_Output.ImageData,0,0);
}