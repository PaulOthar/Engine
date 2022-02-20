let Current_Screen = new Screen('canvas');

Current_Screen.Config_CanvasPixels(600,600);

Current_Screen.Set_LineStyle('white',1,false,false);

let Engine = new EngineRunner(Current_Screen.Width,Current_Screen.Height,90,0.1,1000);


Engine.Camera.Position.x = 0;
Engine.Camera.Position.y = 1;
Engine.Camera.Position.z = 1.5;
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

    Cube.ImageData = id;

    return Cube;
}

//let URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAIAAAAmzuBxAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAxSURBVChTYyAK/McN0FVA2GgiIADlEaMCEyBUQEhkABcHAQQLFaCowAWoqAIfYGAAAEhByzW0Xq4RAAAAAElFTkSuQmCC";
let URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAB5SURBVChTY6yvr//PQCRgAREuLi4Mtra2YIHDhw+DaRBAFtuzZw8DE5gHBDBFMAXYNMMVgwBI4q2MCpgNopEVggCKYkIAQ/G15fNRaGQAVwxzIzpAFgeHBgzg0gADKKHx//9/MEZnwwCKm48cOQJlQQA6n4QYZGAAAHdNOMHvsjQJAAAAAElFTkSuQmCC";
let Img = new Image();


Img.onload = function(){
    Current_Screen.Context.drawImage(Img,0,0);
    let ImgD = Current_Screen.Context.getImageData(0,0,Img.width,Img.height);

    Engine.Mesh_List.push(MakeCube(-1,0,5,ImgD));
    Engine.Mesh_List.push(MakeCube(-1,1,5,ImgD));
    Engine.Mesh_List.push(MakeCube(-1,2,5,ImgD));

    Engine.Mesh_List.push(MakeCube(2,0,5,ImgD));
    Engine.Mesh_List.push(MakeCube(2,1,5,ImgD));
    Engine.Mesh_List.push(MakeCube(2,2,5,ImgD));
    
    Engine.Mesh_List.push(MakeCube(-1,3,5,ImgD));
    Engine.Mesh_List.push(MakeCube(0,3,5,ImgD));
    Engine.Mesh_List.push(MakeCube(1,3,5,ImgD));
    Engine.Mesh_List.push(MakeCube(2,3,5,ImgD));

    Engine.Mesh_List.push(MakeCube(-1,-1,5,ImgD));
    Engine.Mesh_List.push(MakeCube(0,-1,5,ImgD));
    Engine.Mesh_List.push(MakeCube(1,-1,5,ImgD));
    Engine.Mesh_List.push(MakeCube(2,-1,5,ImgD));
}

Img.src = URL;

let Datethen = 0;
let Difference = 0;
let FPS = 0;
let Lowest = 1000;
let Hightest = 0;
function Run(){
    Difference = Date.now() - Datethen;
    Datethen = Date.now();
    FPS = Math.round(1000/Difference);
    Current_Screen.Clear_Screen();
    
    Engine.Camera.Calculate_LookMatrix();
    Engine.Run_Cycle();
    Current_Screen.Context.putImageData(Engine.Texture_Handler.Current_Output.ImageData,0,0);

    if(FPS < Lowest && FPS > 1){
        Lowest = FPS;
    }
    if(FPS > Hightest && FPS < 500){
        Hightest = FPS;
    }
    if(FPS < 40){
        Current_Screen.Set_LineStyle('Red',1,false,false);
    }
    else if(FPS < 60){
        Current_Screen.Set_LineStyle('yellow',1,false,false);
    }
    else{
        Current_Screen.Set_LineStyle('Green',1,false,false);
    }
    Current_Screen.Draw_Text(`FPS: ${FPS} / Lowest : ${Lowest} / Hightest : ${Hightest}`,10,10);
}