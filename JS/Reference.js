class Vec {
    x = 0;
    y = 0;
    z = 0;
    w = 1;

    constructor(x, y, z) {
        if (x || y || z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
    }

    CloneVector(Vector) {
        //Method Used For Solving a Javascript Related Problem, Unfortunely Necessary
        this.x = Vector.x;
        this.y = Vector.y;
        this.z = Vector.z;
        this.w = Vector.w;
    }

    GetCopy() {
        let nv = new Vec();
        nv.x = this.x;
        nv.y = this.y;
        nv.z = this.z;
        return nv;
    }

    SetItself(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Tri {
    points = new Array(0);

    constructor() {
        this.points = new Array(0);
    }

    SetItself(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
        let V1 = new Vec();
        let V2 = new Vec();
        let V3 = new Vec();

        V1.x = x1;
        V1.y = y1;
        V1.z = z1;

        V2.x = x2;
        V2.y = y2;
        V2.z = z2;

        V3.x = x3;
        V3.y = y3;
        V3.z = z3;

        this.points.push(V1);
        this.points.push(V2);
        this.points.push(V3);
    }
}

class Mesh {
    triangles = new Array();

    constructor() {
        this.triangles = new Array();
    }
}

class Matrix {
    m = new Array();

    constructor() {
        this.m = new Array();

        //Adds 4 Rows To The Matrix, Filled With 4 Zeroes, Each
        for (let i = 0; i < 4; i++) {
            this.m.push(new Array());
            for (let l = 0; l < 4; l++) {
                this.m[i].push(0);
            }
        }
    }
}

//Vector To Vector
function Vector_Add(Vector_1, Vector_2) {
    //Adds Two Vectors Together
    let newVec = new Vec();

    newVec.x = Vector_1.x + Vector_2.x;
    newVec.y = Vector_1.y + Vector_2.y;
    newVec.z = Vector_1.z + Vector_2.z;
    return newVec;
}

function Vector_Sub(Vector_1, Vector_2) {
    //Subtracts One Vector From Another, Specially Useful For Calculating Lines
    let newVec = new Vec();

    newVec.x = Vector_1.x - Vector_2.x;
    newVec.y = Vector_1.y - Vector_2.y;
    newVec.z = Vector_1.z - Vector_2.z;
    return newVec;
}

function Vector_Mul(Vector_1, Vector_2) {
    //Multiplies One Vector By Another
    let newVec = new Vec();

    newVec.x = Vector_1.x * Vector_2.x;
    newVec.y = Vector_1.y * Vector_2.y;
    newVec.z = Vector_1.z * Vector_2.z;
    return newVec;
}

function Vector_Div(Vector_1, Vector_2) {
    //Divides One Vector By Another
    let newVec = new Vec();

    newVec.x = Vector_1.x / Vector_2.x;
    newVec.y = Vector_1.y / Vector_2.y;
    newVec.z = Vector_1.z / Vector_2.z;
    return newVec;
}

function Vector_DotProduct(Vector_1, Vector_2) {
    let VX = Vector_1.x * Vector_2.x;
    let VY = Vector_1.y * Vector_2.y;
    let VZ = Vector_1.z * Vector_2.z;

    let Output = VX + VY + VZ;

    return Output;
    //return Vector_1.x * Vector_2.x + Vector_1.y * Vector_2.y + Vector_1.z * Vector_2.z;
}

function Vector_Length(Vector) {
    // L = √(x²+y²+z²)
    let VX = Vector.x * Vector.x;
    let VY = Vector.y * Vector.y;
    let VZ = Vector.z * Vector.z;

    let VXYZ = VX + VY + VZ;

    return Math.sqrt(VXYZ);
    //return sqrtf(Vector_DotProduct(v, v));
}

function Vector_Normalise(Vector) {
    let l = Vector_Length(Vector);
    let newVec = new Vec();

    newVec.x = Vector.x / l;
    newVec.y = Vector.y / l;
    newVec.z = Vector.z / l;
    return newVec;
}

function Vector_CrossProduct(Vector_1, Vector_2) {
    let OutputVector = new Vec();
    OutputVector.x = Vector_1.y * Vector_2.z - Vector_1.z * Vector_2.y;
    OutputVector.y = Vector_1.z * Vector_2.x - Vector_1.x * Vector_2.z;
    OutputVector.z = Vector_1.x * Vector_2.y - Vector_1.y * Vector_2.x;
    return OutputVector;
}

function Vector_IntersectPlane(Plane_Point, Plane_Normal, lineStart, lineEnd) {
    //This Returns Where on the Line, it Intersects With a Plane

    //Good Practice to make sure that the Normal is indeed normalized
    Plane_Normal = Vector_Normalise(Plane_Normal);

    let Plane_DotProduct = -Vector_DotProduct(Plane_Normal, Plane_Point);
    let Start_Normal_DotProduct = Vector_DotProduct(lineStart, Plane_Normal);
    let End_Normal_DotProduct = Vector_DotProduct(lineEnd, Plane_Normal);
    let Temporary = (-Plane_DotProduct - Start_Normal_DotProduct) / (End_Normal_DotProduct - Start_Normal_DotProduct);
    let lineStartToEnd = Vector_Sub(lineEnd, lineStart);
    let lineToIntersect = Vector_Mul_Value(lineStartToEnd, Temporary);

    return Vector_Add(lineStart, lineToIntersect);
}

function Vector_Insideness(Plane_Normal, Plane_DotProduct, Vector) {
    //Returns a Value of How Much a Vector is Inside the Plane (That means, not against the normal)
    //A Negative Output Means that the Vector is Outside of the Plane

    //let Normal = Vector_Normalise(Vector);

    //let Plane_DotProduct = Vector_DotProduct(Plane_Normal, Plane_Point);

    let X = Plane_Normal.x * Vector.x;
    let Y = Plane_Normal.y * Vector.y;
    let Z = Plane_Normal.z * Vector.z;

    return X + Y + Z - Plane_DotProduct;
}

function Triangle_ClipAgainstPlane(Plane_Point, Plane_Normal, Triangle) {
    let Output = new Array();

    let Original_Vector_1 = Triangle.points[0];
    let Original_Vector_2 = Triangle.points[1];
    let Original_Vector_3 = Triangle.points[2];

    //Good Practice to make sure that the Normal is indeed normalized
    Plane_Normal = Vector_Normalise(Plane_Normal);

    let Plane_DotProduct = Vector_DotProduct(Plane_Normal, Plane_Point);

    let Inside_Vectors = new Array();
    let Outside_Vectors = new Array();

    if (Vector_Insideness(Plane_Normal, Plane_DotProduct, Original_Vector_1) >= 0) {
        Inside_Vectors.push(Original_Vector_1);
    }
    else {
        Outside_Vectors.push(Original_Vector_1);
    }

    if (Vector_Insideness(Plane_Normal, Plane_DotProduct, Original_Vector_2) >= 0) {
        Inside_Vectors.push(Original_Vector_2);
    }
    else {
        Outside_Vectors.push(Original_Vector_2);
    }

    if (Vector_Insideness(Plane_Normal, Plane_DotProduct, Original_Vector_3) >= 0) {
        Inside_Vectors.push(Original_Vector_3);
    }
    else {
        Outside_Vectors.push(Original_Vector_3);
    }


    //For The Javascript Bug
    let New_Point_1 = 0;
    let New_Point_2 = 0;

    switch (Inside_Vectors.length) {
        case 3:
            Output.push(Triangle);
            break;
        case 2:
            New_Point_1 = 0;
            New_Point_2 = 0;

            let Inside_Point_1 = Inside_Vectors[0];
            let Inside_Point_2 = Inside_Vectors[1];
            let Outside_Point = Outside_Vectors[0];

            New_Point_1 = Vector_IntersectPlane(Plane_Point, Plane_Normal, Inside_Point_1, Outside_Point);
            New_Point_2 = Vector_IntersectPlane(Plane_Point, Plane_Normal, Inside_Point_2, Outside_Point);

            let Output_Triangle_1 = new Tri();
            let Output_Triangle_2 = new Tri();

            //The .GetCopy(), is a Javascript Problem Correction...

            Output_Triangle_1.points.push(Inside_Point_1.GetCopy());
            Output_Triangle_1.points.push(Inside_Point_2.GetCopy());
            Output_Triangle_1.points.push(New_Point_1.GetCopy());

            Output_Triangle_2.points.push(Inside_Point_2.GetCopy());
            Output_Triangle_2.points.push(New_Point_1.GetCopy());
            Output_Triangle_2.points.push(New_Point_2.GetCopy());
            //Output_Triangle_2.points.push(New_Point_1.GetCopy());

            //It Doesnt Quite Work... Shouldnt Switched From Java To Javascript
            //I Regret My Reckless Decisions on Life

            Output.push(Output_Triangle_1);
            Output.push(Output_Triangle_2);
            break;
        case 1:
            New_Point_1 = 0;
            New_Point_2 = 0;

            let Inside_Point = Inside_Vectors[0];
            let Outside_Point_1 = Outside_Vectors[0];
            let Outside_Point_2 = Outside_Vectors[1];

            New_Point_1 = Vector_IntersectPlane(Plane_Point, Plane_Normal, Inside_Point, Outside_Point_1);
            New_Point_2 = Vector_IntersectPlane(Plane_Point, Plane_Normal, Inside_Point, Outside_Point_2);

            let Output_Triangle = new Tri();

            Output_Triangle.points.push(Inside_Point);
            Output_Triangle.points.push(New_Point_1);
            Output_Triangle.points.push(New_Point_2);

            Output.push(Output_Triangle);
            break;
        case 0:
            break;
    }

    return Output;
}

function Triangle_CalculateNormal(Vector_1, Vector_2, Vector_3) {
    let Line_1 = Vector_Sub(Vector_2,Vector_1);
    let Line_2 = Vector_Sub(Vector_3,Vector_1);
    let Normal = Vector_CrossProduct(Line_1, Line_2);
    let Normal_Length = Vector_Length(Normal);

    Normal.x /= Normal_Length;
    Normal.y /= Normal_Length;
    Normal.z /= Normal_Length;

    return Normal;
}

//Value To Vector
function Vector_Add_Value(Vector, Value) {
    //Adds a Value To All Vector's Axis
    let newVec = new Vec();

    newVec.x = Vector.x + Value;
    newVec.y = Vector.y + Value;
    newVec.z = Vector.z + Value;
    return newVec;
}

function Vector_Sub_Value(Vector, Value) {
    //Subtracts a Value To All Vector's Axis
    let newVec = new Vec();

    newVec.x = Vector.x - Value;
    newVec.y = Vector.y - Value;
    newVec.z = Vector.z - Value;
    return newVec;
}

function Vector_Mul_Value(Vector, Value) {
    //Multiplies a Value To All Vector's Axis
    let newVec = new Vec();

    newVec.x = Vector.x * Value;
    newVec.y = Vector.y * Value;
    newVec.z = Vector.z * Value;
    return newVec;
}

function Vector_Div_Value(Vector, Value) {
    //Divides a Value To All Vector's Axis
    let newVec = new Vec();

    newVec.x = Vector.x / Value;
    newVec.y = Vector.y / Value;
    newVec.z = Vector.z / Value;
    return newVec;
}

//Matrix Manipulation Section:
function Matrix_MultiplyVector(Matrix, InputVector) {
    //This Function will Multiply A Matrix of 4x4, To a Vector of 3 Dimentios, But with 4 Parameters
    let OutputVector = new Vec();
    OutputVector.x = InputVector.x * Matrix.m[0][0] + InputVector.y * Matrix.m[1][0] + InputVector.z * Matrix.m[2][0] + InputVector.w * Matrix.m[3][0];
    OutputVector.y = InputVector.x * Matrix.m[0][1] + InputVector.y * Matrix.m[1][1] + InputVector.z * Matrix.m[2][1] + InputVector.w * Matrix.m[3][1];
    OutputVector.z = InputVector.x * Matrix.m[0][2] + InputVector.y * Matrix.m[1][2] + InputVector.z * Matrix.m[2][2] + InputVector.w * Matrix.m[3][2];
    OutputVector.w = InputVector.x * Matrix.m[0][3] + InputVector.y * Matrix.m[1][3] + InputVector.z * Matrix.m[2][3] + InputVector.w * Matrix.m[3][3];

    return OutputVector;
}

function Matrix_MakeIdentity() {
    //This Matrix Makes Sure that No Multiplication with a vector Results with a 0 on the end of a parameter
    let matrix = new Matrix();
    matrix.m[0][0] = 1.0;
    matrix.m[1][1] = 1.0;
    matrix.m[2][2] = 1.0;
    matrix.m[3][3] = 1.0;
    return matrix;
}

function Matrix_MakeRotationX(Angle_Rad) {
    //Rotates The Y and Z Axis
    let matrix = new Matrix();
    matrix.m[0][0] = 1;
    matrix.m[1][1] = Math.cos(Angle_Rad);
    matrix.m[1][2] = Math.sin(Angle_Rad);
    matrix.m[2][1] = -Math.sin(Angle_Rad);
    matrix.m[2][2] = Math.cos(Angle_Rad);
    matrix.m[3][3] = 1;
    return matrix;
}

function Matrix_MakeRotationY(Angle_Rad) {
    //Rotates The X and Z Axis
    let matrix = new Matrix();
    matrix.m[0][0] = Math.cos(Angle_Rad);
    matrix.m[0][2] = Math.sin(Angle_Rad);
    matrix.m[2][0] = -Math.sin(Angle_Rad);
    matrix.m[1][1] = 1;
    matrix.m[2][2] = Math.cos(Angle_Rad);
    matrix.m[3][3] = 1;
    return matrix;
}

function Matrix_MakeRotationZ(Angle_Rad) {
    //Rotates The X and Y Axis
    let matrix = new Matrix();
    matrix.m[0][0] = Math.cos(Angle_Rad);
    matrix.m[0][1] = Math.sin(Angle_Rad);
    matrix.m[1][0] = -Math.sin(Angle_Rad);
    matrix.m[1][1] = Math.cos(Angle_Rad);
    matrix.m[2][2] = 1;
    matrix.m[3][3] = 1;
    return matrix;
}

function Matrix_MakeTranslation(x, y, z) {
    //Moves The Vector Around, Specially usefull when Moving the Camera Around
    let matrix = new Matrix();
    matrix.m[0][0] = 1;
    matrix.m[1][1] = 1;
    matrix.m[2][2] = 1;
    matrix.m[3][3] = 1;
    matrix.m[3][0] = x;
    matrix.m[3][1] = y;
    matrix.m[3][2] = z;
    return matrix;
}

function Matrix_MakeProjection(Fov_Degrees, Aspect_Ratio, Near_Distance, Far_Distance) {
    //This Matrix Will Translate 3D to 2D By Using Some Screen and Perseption Parameters
    let Fov_Radians = 1 / Math.tan(Fov_Degrees * 0.5 / 180 * 3.14159);
    let matrix = new Matrix();
    matrix.m[0][0] = Aspect_Ratio * Fov_Radians;
    matrix.m[1][1] = Fov_Radians;
    matrix.m[2][2] = Far_Distance / (Far_Distance - Near_Distance);
    matrix.m[3][2] = (-Far_Distance * Near_Distance) / (Far_Distance - Near_Distance);
    matrix.m[2][3] = 1;
    matrix.m[3][3] = 0;

    return matrix;
}

function Matrix_MultiplyMatrix(Matrix_1, Matrix_2) {
    //Matrix Multiplication With Another Matrix, Specially Usefull When Needed To Combine 2 Matrices

    let matrix = new Matrix();
    for (let c = 0; c < 4; c++) {
        //C For Columns
        for (let r = 0; r < 4; r++) {
            //R For Rows
            let M0 = Matrix_1.m[r][0] * Matrix_2.m[0][c];
            let M1 = Matrix_1.m[r][1] * Matrix_2.m[1][c];
            let M2 = Matrix_1.m[r][2] * Matrix_2.m[2][c];
            let M3 = Matrix_1.m[r][3] * Matrix_2.m[3][c];

            matrix.m[r][c] = M0 + M1 + M2 + M3;
            //matrix.m[r][c] = Matrix_1.m[r][0] * Matrix_2.m[0][c] + Matrix_1.m[r][1] * Matrix_2.m[1][c] + Matrix_1.m[r][2] * Matrix_2.m[2][c] + Matrix_1.m[r][3] * Matrix_2.m[3][c];
        }
    }
    return matrix;
}

function Matrix_QuickInverse(InputMatrix) // Only for Rotation/Translation Matrices
{
    let OutputMatrix = new Matrix();
    OutputMatrix.m[0][0] = InputMatrix.m[0][0]; OutputMatrix.m[0][1] = InputMatrix.m[1][0]; OutputMatrix.m[0][2] = InputMatrix.m[2][0]; OutputMatrix.m[0][3] = 0.0;
    OutputMatrix.m[1][0] = InputMatrix.m[0][1]; OutputMatrix.m[1][1] = InputMatrix.m[1][1]; OutputMatrix.m[1][2] = InputMatrix.m[2][1]; OutputMatrix.m[1][3] = 0.0;
    OutputMatrix.m[2][0] = InputMatrix.m[0][2]; OutputMatrix.m[2][1] = InputMatrix.m[1][2]; OutputMatrix.m[2][2] = InputMatrix.m[2][2]; OutputMatrix.m[2][3] = 0.0;
    OutputMatrix.m[3][0] = -(InputMatrix.m[3][0] * OutputMatrix.m[0][0] + InputMatrix.m[3][1] * OutputMatrix.m[1][0] + InputMatrix.m[3][2] * OutputMatrix.m[2][0]);
    OutputMatrix.m[3][1] = -(InputMatrix.m[3][0] * OutputMatrix.m[0][1] + InputMatrix.m[3][1] * OutputMatrix.m[1][1] + InputMatrix.m[3][2] * OutputMatrix.m[2][1]);
    OutputMatrix.m[3][2] = -(InputMatrix.m[3][0] * OutputMatrix.m[0][2] + InputMatrix.m[3][1] * OutputMatrix.m[1][2] + InputMatrix.m[3][2] * OutputMatrix.m[2][2]);
    OutputMatrix.m[3][3] = 1.0;
    return OutputMatrix;
}

function Matrix_PointAt(Camera_Position,Camera_Forward,Camera_Upwards) {
    let Forward_Direction = Vector_Sub(Camera_Forward, Camera_Position);
    Forward_Direction = Vector_Normalise(Forward_Direction);

    let Forward_Correction = Vector_Mul_Value(Forward_Direction, Vector_DotProduct(Camera_Upwards, Forward_Direction));
    let Up_Direction = Vector_Sub(Camera_Upwards, Forward_Correction);
    Up_Direction = Vector_Normalise(Up_Direction);

    let Right_Direction = Vector_CrossProduct(Up_Direction, Forward_Direction);

    let OutputMatrix = new Matrix();
    OutputMatrix.m[0][0] = Right_Direction.x; 
    OutputMatrix.m[0][1] = Right_Direction.y; 
    OutputMatrix.m[0][2] = Right_Direction.z; 
    OutputMatrix.m[0][3] = 0.0;

    OutputMatrix.m[1][0] = Up_Direction.x; 
    OutputMatrix.m[1][1] = Up_Direction.y;
    OutputMatrix.m[1][2] = Up_Direction.z; 
    OutputMatrix.m[1][3] = 0.0;

    OutputMatrix.m[2][0] = Forward_Direction.x; 
    OutputMatrix.m[2][1] = Forward_Direction.y; 
    OutputMatrix.m[2][2] = Forward_Direction.z;
    OutputMatrix.m[2][3] = 0.0;

    OutputMatrix.m[3][0] = Camera_Position.x; 
    OutputMatrix.m[3][1] = Camera_Position.y; 
    OutputMatrix.m[3][2] = Camera_Position.z; 
    OutputMatrix.m[3][3] = 1.0;

    return OutputMatrix;
}

function Matrix_Print(Matrix) {
    console.log(Matrix);
}

//Game Major Utility Functions

function Triangle_ClipAgainstScreen(Screen_Width, Screen_Heigth, Projected_Triangle) {
    //It Outputs a List of Clipped Triangles
    let Clipped_Triangles = new Array();

    /*

    Screen:
    X:0                                X:W
 Y:0_____________________________________
    |(TL_Corner) [T_Normal]   (TR_Corner)
    |                 |
    |                 V
    |
    |[L_Normal] ->          <- [R_Normal]
    |
    |                 ^
    |                 |
 Y:H|(BL_Corner)  [B_Normal]

    */

    let TL_Corner = new Vec();//0,0,0
    let T_Normal = new Vec();//0,1,0

    let L_Normal = new Vec();//1,0,0

    let BL_Corner = new Vec();//0,H-1,0
    let B_Normal = new Vec();//0,-1,0

    let TR_Corner = new Vec();//W-1,0,0
    let R_Normal = new Vec();//-1,0,0

    T_Normal.y = 1;
    L_Normal.x = 1;
    BL_Corner.y = Screen_Heigth - 1;
    B_Normal.y = -1;
    TR_Corner.x = Screen_Width - 1;
    R_Normal.x = -1;


    Clipped_Triangles = Triangle_ClipAgainstPlane(TL_Corner, T_Normal, Projected_Triangle);

    function Triangle_ClipAgainstScreenPlane(PlanePoint,PlaneNormal,Clipped_Tri_List){
        let Newly_ClippedTriangles = new Array();

        for(let i = 0;i < Clipped_Tri_List.length;i++){
            let New_Batch = Triangle_ClipAgainstPlane(PlanePoint, PlaneNormal, Clipped_Tri_List[i]);

            for (let l = 0; l < New_Batch.length; l++) {
                Newly_ClippedTriangles.push(New_Batch[l]);
            }
        }

        return Newly_ClippedTriangles;
    }

    Clipped_Triangles = Triangle_ClipAgainstScreenPlane(TL_Corner, L_Normal,Clipped_Triangles);

    Clipped_Triangles = Triangle_ClipAgainstScreenPlane(BL_Corner, B_Normal,Clipped_Triangles);

    Clipped_Triangles = Triangle_ClipAgainstScreenPlane(TR_Corner, R_Normal,Clipped_Triangles);

    /*

    let newly_ClippedTriangles = new Array();

    for (let i = 0; i < Clipped_Triangles.length; i++) {
        let New_Batch = Triangle_ClipAgainstPlane(TL_Corner, L_Normal, Clipped_Triangles[i]);

        for (let l = 0; l < New_Batch.length; l++) {
            newly_ClippedTriangles.push(New_Batch[l]);
        }
    }

    Clipped_Triangles = newly_ClippedTriangles;
    newly_ClippedTriangles = new Array();

    for (let i = 0; i < Clipped_Triangles.length; i++) {
        let New_Batch = Triangle_ClipAgainstPlane(BL_Corner, B_Normal, Clipped_Triangles[i]);

        for (let l = 0; l < New_Batch.length; l++) {
            newly_ClippedTriangles.push(New_Batch[l]);
        }
    }

    Clipped_Triangles = newly_ClippedTriangles;
    newly_ClippedTriangles = new Array();

    for (let i = 0; i < Clipped_Triangles.length; i++) {
        let New_Batch = Triangle_ClipAgainstPlane(TR_Corner, R_Normal, Clipped_Triangles[i]);

        for (let l = 0; l < New_Batch.length; l++) {
            newly_ClippedTriangles.push(New_Batch[l]);
        }
    }

    Clipped_Triangles = newly_ClippedTriangles;
    */

    return Clipped_Triangles;
}

function Triangle_Project(Screen_Width, Screen_Heigth, Triangle, ProjectionMatrix) {
    Triangle.points[0] = Matrix_MultiplyVector(ProjectionMatrix, Triangle.points[0]);
    Triangle.points[1] = Matrix_MultiplyVector(ProjectionMatrix, Triangle.points[1]);
    Triangle.points[2] = Matrix_MultiplyVector(ProjectionMatrix, Triangle.points[2]);

    //Testing
    Triangle.points[0] = Vector_Div_Value(Triangle.points[0], Triangle.points[0].w);
    Triangle.points[1] = Vector_Div_Value(Triangle.points[1], Triangle.points[1].w);
    Triangle.points[2] = Vector_Div_Value(Triangle.points[2], Triangle.points[2].w);

    Triangle.points[0] = Vector_Mul_Value(Triangle.points[0], -1);
    Triangle.points[1] = Vector_Mul_Value(Triangle.points[1], -1);
    Triangle.points[2] = Vector_Mul_Value(Triangle.points[2], -1);

    let Offset = new Vec();
    Offset.x = 1;
    Offset.y = 1;

    Triangle.points[0] = Vector_Add(Triangle.points[0], Offset);
    Triangle.points[1] = Vector_Add(Triangle.points[1], Offset);
    Triangle.points[2] = Vector_Add(Triangle.points[2], Offset);

    Triangle.points[0].x *= Screen_Width * 0.5;
    Triangle.points[0].y *= Screen_Heigth * 0.5;

    Triangle.points[1].x *= Screen_Width * 0.5;
    Triangle.points[1].y *= Screen_Heigth * 0.5;

    Triangle.points[2].x *= Screen_Width * 0.5;
    Triangle.points[2].y *= Screen_Heigth * 0.5;

    return Triangle;
}

console.log(Vector_IntersectPlane(new Vec(0,0,0),new Vec(1,1,0),new Vec(-2,-1,0),new Vec(2,2,0)));

//Game Definition

let Aspect_Ratio = canvas.height / canvas.width;
let Field_Of_View = 90;
let Near_Distance = 0.1;
let Far_Distance = 1000;
let Frames_Per_Second = 60;

let Static_ProjectionMatrix = Matrix_MakeProjection(Field_Of_View, Aspect_Ratio, Near_Distance, Far_Distance);

//Object

let mesh = new Mesh();

let Ambient = 0;

//Axis Pyramid
mesh.triangles.push(new Tri());
mesh.triangles[Ambient++].SetItself(-3.0, 0.0, 0.0  ,  -1.5, -0.866, -0.866 , -1.5, -0.866, 0.866);
mesh.triangles.push(new Tri());
mesh.triangles[Ambient++].SetItself(-3.0, 0.0, 0.0  ,  -1.5, +0.866, +0.0 , -1.5, -0.866, -0.866);
mesh.triangles.push(new Tri());
mesh.triangles[Ambient++].SetItself(-3.0, 0.0, 0.0  ,  -1.5, -0.866, 0.866 , -1.5, +0.866, +0.0);
mesh.triangles.push(new Tri());
mesh.triangles[Ambient++].SetItself(-1.5, 0.866, 0  ,  -1.5, -0.866, 0.866 , -1.5, -0.866, -0.866);

//Floor
mesh.triangles.push(new Tri());
mesh.triangles[Ambient++].SetItself(+10.0, -10.0, +10.0  ,  -10.0, -10.0, -10.0 , -10.0, -10.0, +10.0);
mesh.triangles.push(new Tri());
mesh.triangles[Ambient++].SetItself(+10.0, -10.0, +10.0  ,  +10.0, -10.0, -10.0 , -10.0, -10.0, -10.0);

//Swee Swee
let SweeSwee = Ambient;
//Z- Face
mesh.triangles.push(new Tri());
mesh.triangles[SweeSwee++].SetItself(0.0, 0.0, 0.0  , 2.0, 1.0, 0.0  , 2.0, 0.0, -0.5);
mesh.triangles.push(new Tri());
mesh.triangles[SweeSwee++].SetItself(0.0, 0.0, 0.0  , 2.0, 0.0, -0.5  , 2.0, -1.0, 0.0);

//Body
mesh.triangles.push(new Tri());
mesh.triangles[SweeSwee++].SetItself(2.0, 1.0, 0.0  , 7.0, 1.0, 0.0  , 7.0, 0.0, -0.5);
mesh.triangles.push(new Tri());
mesh.triangles[SweeSwee++].SetItself(2.0, 1.0, 0.0  , 7.0, 0.0, -0.5 , 2.0, 0.0, -0.5);
mesh.triangles.push(new Tri());
mesh.triangles[SweeSwee++].SetItself(2.0, 0.0, -0.5  , 7.0, 0.0, -0.5  , 2.0, -1.0, 0.0);
mesh.triangles.push(new Tri());
mesh.triangles[SweeSwee++].SetItself(2.0, -1.0, 0.0  , 7.0, 0.0, -0.5 , 7.0, -1.0, 0.0);

//Fin
mesh.triangles.push(new Tri());
mesh.triangles[SweeSwee++].SetItself(7.0, 1.0, 0.0  , 9.0, 2.0, 0.0  , 8.5, 0.8, 0.0);

//Tail 1
mesh.triangles.push(new Tri());
mesh.triangles[SweeSwee++].SetItself(7.0, 1.0, 0.0  , 12.0, 0.3, 0.0  , 7.0, 0.0, -0.5);
mesh.triangles.push(new Tri());
mesh.triangles[SweeSwee++].SetItself(7.0, 0.0, -0.5  , 12.0, -0.3, 0.0 , 7.0, -1.0, 0.0);

mesh.triangles.push(new Tri());
mesh.triangles[SweeSwee++].SetItself(7.0, 0.0, -0.5  , 12.0, 0.3, 0.0  , 12.0, 0.0, -0.3);
mesh.triangles.push(new Tri());
mesh.triangles[SweeSwee++].SetItself(7.0, 0.0, -0.5  , 12.0, 0.0, -0.3 , 12.0, -0.3, 0.0);

//Tail 2
mesh.triangles.push(new Tri());
mesh.triangles[SweeSwee++].SetItself(12.0, 0.3, 0.0  , 14.0, 2.0, 0.0  , 12.0, 0.0, -0.3);
mesh.triangles.push(new Tri());
mesh.triangles[SweeSwee++].SetItself(12.0, 0.0, -0.3  , 14.0, 2.0, 0.0 , 14.0, -2.0, 0.0);
mesh.triangles.push(new Tri());
mesh.triangles[SweeSwee++].SetItself(12.0, 0.0, -0.3  , 14.0, -2.0, 0.0  , 12.0, -0.3, 0.0);


/*
// SOUTH
mesh.triangles.push(new Tri());
mesh.triangles[0].SetItself(0.0, 0.0, 0.0  , 0.0, 1.0, 0.0  , 1.0, 1.0, 0.0);
mesh.triangles.push(new Tri());
mesh.triangles[1].SetItself(0.0, 0.0, 0.0  , 1.0, 1.0, 0.0  , 1.0, 0.0, 0.0);

// EAST                                                      
mesh.triangles.push(new Tri());
mesh.triangles[2].SetItself(1.0, 0.0, 0.0  , 1.0, 1.0, 0.0  , 1.0, 1.0, 1.0);
mesh.triangles.push(new Tri());
mesh.triangles[3].SetItself(1.0, 0.0, 0.0  , 1.0, 1.0, 1.0  , 1.0, 0.0, 1.0);

// NORTH                                                     
mesh.triangles.push(new Tri());
mesh.triangles[4].SetItself(1.0, 0.0, 1.0  , 1.0, 1.0, 1.0  , 0.0, 1.0, 1.0);
mesh.triangles.push(new Tri());
mesh.triangles[5].SetItself(1.0, 0.0, 1.0  , 0.0, 1.0, 1.0  , 0.0, 0.0, 1.0);

// WEST                                                      
mesh.triangles.push(new Tri());
mesh.triangles[6].SetItself(0.0, 0.0, 1.0  , 0.0, 1.0, 1.0  , 0.0, 1.0, 0.0);
mesh.triangles.push(new Tri());
mesh.triangles[7].SetItself(0.0, 0.0, 1.0  , 0.0, 1.0, 0.0  , 0.0, 0.0, 0.0);

// TOP                                                       
mesh.triangles.push(new Tri());
mesh.triangles[8].SetItself(0.0, 1.0, 0.0  , 0.0, 1.0, 1.0  , 1.0, 1.0, 1.0);
mesh.triangles.push(new Tri());
mesh.triangles[9].SetItself(0.0, 1.0, 0.0  , 1.0, 1.0, 1.0  , 1.0, 1.0, 0.0);

// BOTTOM                                                    
mesh.triangles.push(new Tri());
mesh.triangles[10].SetItself(1.0, 0.0, 1.0  , 0.0, 0.0, 1.0  , 0.0, 0.0, 0.0);
mesh.triangles.push(new Tri());
mesh.triangles[11].SetItself(1.0, 0.0, 1.0  , 0.0, 0.0, 0.0  , 1.0, 0.0, 0.0);
*/

//Game Manipulation
let Cam_XZ = 0, Cam_YZ = 0;
let Camera = new Vec(0,0,0);
let LookDir = new Vec();
let Forward = new Vec();
let Sideways = new Vec();

let Walk_Step = 0.1;
let Rotate_Step = 5;

let Colors = ["Red", "Green", "Blue", "Yellow", "Aqua", "Purple","Grey","White"]
let Current_Color = 0;

let RodaRodaJekiti = 0;

let Roda = false;

function Running() {
    Current_Color = 0;
    PaintCanvas("Black");

    //World Space Stuff
    let Basic_Translation_Matrix = Matrix_MakeIdentity();
    if(Roda){
        RodaRodaJekiti++;
    }
    let rot1 = Matrix_MakeRotationZ((RodaRodaJekiti/2*Math.PI)/180);
    let rot2 = Matrix_MakeRotationX((RodaRodaJekiti*Math.PI)/180);
    let trans = Matrix_MakeTranslation(0, 0, +5);

    Basic_Translation_Matrix = Matrix_MultiplyMatrix(rot1,rot2);
    Basic_Translation_Matrix = Matrix_MultiplyMatrix(Basic_Translation_Matrix,trans);

    //View Space Stuff
    let Up = new Vec(0,1,0);
    let Target = new Vec(0,0,1);

    Camera_Y_Rotation_Matrix = Matrix_MakeRotationY((Cam_XZ*Math.PI)/180);
    Camera_X_Rotation_Matrix = Matrix_MakeRotationX((Cam_YZ*Math.PI)/180);
    Camera_XY_Rotation_Matrix = Matrix_MultiplyMatrix(Camera_X_Rotation_Matrix,Camera_Y_Rotation_Matrix);

    //LookDir.CloneVector(Matrix_MultiplyVector(Camera_Y_Rotation_Matrix,Target));
    LookDir.CloneVector(Matrix_MultiplyVector(Camera_XY_Rotation_Matrix,Target));

    let Foward_LookDir = Matrix_MultiplyVector(Camera_Y_Rotation_Matrix,Target)

    Target = Vector_Add(Camera,LookDir);
    
    //Forward = Vector_Mul_Value(LookDir,Walk_Step);
    Forward = Vector_Mul_Value(Foward_LookDir,Walk_Step);
    //My own personal touch,to walk sideways
    Sideways = Matrix_MultiplyVector(Matrix_MakeRotationY((Math.PI)/2),Forward);

    Camera_Matrix = Matrix_PointAt(Camera,Target,Up);

    View_Matrix = Matrix_QuickInverse(Camera_Matrix);

    //Game Process
    let Triangles_To_Draw = new Array();

    for (let i = 0; i < mesh.triangles.length; i++) {
        let Current_Triangle = mesh.triangles[i];

        let Vec1 = Current_Triangle.points[0];
        let Vec2 = Current_Triangle.points[1];
        let Vec3 = Current_Triangle.points[2];

        //First, We Translate The Triangle
        Vec1 = Matrix_MultiplyVector(Basic_Translation_Matrix, Vec1);
        Vec2 = Matrix_MultiplyVector(Basic_Translation_Matrix, Vec2);
        Vec3 = Matrix_MultiplyVector(Basic_Translation_Matrix, Vec3);


        let Translated = new Tri();
        Translated.points.push(Vec1);
        Translated.points.push(Vec2);
        Translated.points.push(Vec3);

        //Then We Check if The Face Is Pointing at Us
        let TriNormal = Triangle_CalculateNormal(Vec1, Vec2, Vec3);
        TriNormal = Vector_Normalise(TriNormal);

        let CameraRay = Vector_Sub(Vec1,Camera);

        let DProd = Vector_DotProduct(TriNormal, CameraRay);

        if (!(DProd < 0)) {
            continue;
            //Skip to the next Triangle
        }

        //After The Check, we must apply the view matrix, for camera movement
        let Viewed = new Tri();

        Vec1 = Translated.points[0];
        Vec2 = Translated.points[1];
        Vec3 = Translated.points[2];

        Vec1 = Matrix_MultiplyVector(View_Matrix, Vec1);
        Vec2 = Matrix_MultiplyVector(View_Matrix, Vec2);
        Vec3 = Matrix_MultiplyVector(View_Matrix, Vec3);

        Viewed.points.push(Vec1);
        Viewed.points.push(Vec2);
        Viewed.points.push(Vec3);

        //The Next Step, Nearly The End, We Must Clip The Triangle With The Imediate Front Camera Space
        //Because it Can Glitch Really Bad When you are able to see stuff behind you
        //let Front_Clipped = [Translated]
        let Front_Clipped = Triangle_ClipAgainstPlane(new Vec(0,0,0.1),new Vec(0,0,1),Viewed);

        //After That, We Project The Triangle To The Screen (Aka, Transform From 3D to 2D)
        let Projected_List = new Array();
        for (let l = 0; l < Front_Clipped.length; l++) {
            Projected_List.push(Triangle_Project(canvas.width, canvas.height, Front_Clipped[l], Static_ProjectionMatrix));
        }

        //Finally, We Clip The Triangle To The Screen
        for (let l = 0; l < Projected_List.length; l++) {
            let Screen_Clipped = Triangle_ClipAgainstScreen(canvas.width, canvas.height, Projected_List[l]);

            //After The Last Step, We Push The Translated/Seeable/Projected/Clipped Triangles to the Drawing List
            for (let c = 0; c < Screen_Clipped.length; c++) {
                Triangles_To_Draw.push(Screen_Clipped[c]);
            }
        }
    }

    //Drawing Loop
    for (let i = 0; i < Triangles_To_Draw.length; i++) {
        let Current_Triangle = Triangles_To_Draw[i];

        let Vec1 = Current_Triangle.points[0];
        let Vec2 = Current_Triangle.points[1];
        let Vec3 = Current_Triangle.points[2];

        //DrawTriangle(Vec1.x, Vec1.y, Vec2.x, Vec2.y, Vec3.x, Vec3.y);
        PaintAndDrawTriangle(Colors[Current_Color], Vec1.x, Vec1.y, Vec2.x, Vec2.y, Vec3.x, Vec3.y);
        Current_Color++;
        if (Current_Color > Colors.length) {
            Current_Color = 0;
        }
    }
    DrawText(`Camera Coordinates: [X: ${Camera.x.toFixed(2)}] [Y: ${Camera.y.toFixed(2)}] [Z: ${Camera.z.toFixed(2)}]`, 10, 10);
    DrawText(`Camera Look Direction: [X: ${LookDir.x.toFixed(2)}] [Y: ${LookDir.y.toFixed(2)}] [Z: ${LookDir.z.toFixed(2)}]`, 10, 20);
    DrawText(`Camera Step Forward Direction: [X: ${Forward.x.toFixed(2)}] [Y: ${Forward.y.toFixed(2)}] [Z: ${Forward.z.toFixed(2)}]`, 10, 30);
    DrawText(`Camera Angles: [L/R: ${Cam_XZ}] [U/D: ${Cam_YZ}]`, 10, 40);
    DrawText(`Triangles: ${Triangles_To_Draw.length}`, 10, 50);
}

function TexturedTriangle(){

}

let MainLoop;

function Start() {
    MainLoop = setInterval(Running, 1000 / Frames_Per_Second);
}

function Stop() {
    clearInterval(MainLoop);
}

//To Use With the Keyboard Manager

function More_X() {
    //Camera += Walk_Step;
    Camera.CloneVector(Vector_Add(Camera,Sideways));
}
function Less_X() {
    //Camera.x -= Walk_Step;
    Camera.CloneVector(Vector_Sub(Camera,Sideways));
}
function More_Y() {
    Camera.y += Walk_Step;
}
function Less_Y() {
    Camera.y -= Walk_Step;
}
function More_Z() {
    //Camera.z += Walk_Step;
    Camera.CloneVector(Vector_Add(Camera,Forward));
}
function Less_Z() {
    //Camera.z -= Walk_Step;
    Camera.CloneVector(Vector_Sub(Camera,Forward));
}

function More_XZ() {
    Cam_XZ += Rotate_Step;
    if (Cam_XZ >= 360) {
        Cam_XZ = 0;
    }
}
function Less_XZ() {
    Cam_XZ -= Rotate_Step;
    if (Cam_XZ < 0) {
        Cam_XZ = 360-Rotate_Step;
    }
}

function More_YZ() {
    Cam_YZ += 5;
    if (Cam_YZ >= 360) {
        Cam_YZ = 0;
    }
}
function Less_YZ() {
    Cam_YZ -= 5;
    if (Cam_YZ < 0) {
        Cam_YZ = 360-Rotate_Step;
    }
}

KeyboardManager.AddAllBasicFunctions(document);
KeyboardManager.AddKey(document, "w", More_Z);
KeyboardManager.AddKey(document, "s", Less_Z);
KeyboardManager.AddKey(document, "d", More_X);
KeyboardManager.AddKey(document, "a", Less_X);
KeyboardManager.AddKey(document, " ", More_Y);
KeyboardManager.AddKey(document, "Control", Less_Y);

KeyboardManager.AddKey(document, "ArrowRight", More_XZ);
KeyboardManager.AddKey(document, "ArrowLeft", Less_XZ);
KeyboardManager.AddKey(document, "ArrowDown", More_YZ);
KeyboardManager.AddKey(document, "ArrowUp", Less_YZ);

//Soluxon para meu eu do futuro:

/*
Não Dá Para Ler Imagens Direto, e salvar como Data URL, pois necessita de um servideiro intermediário

Solução:

Criar um Input Reader, com:
let inpt = document.createElement("input");

Definir o Input pra Files:
inpt.type = "file";

Depois Criar um File Reader:
let Reader = new FileReader();

Então clicar virtualmente no botão do input:
inpt.click();

Com isso, vai aparecer a janela de selecionar arquivos.

Depois de selecionar o arquivo, ele vai ficar armazenado no array "files" do input

Depois, Ler o Arquivo com o Reader, com a função Read as Data URL:
Reader.readAsDataURL(inpt.files[0]);

O 0 é o primeiro arquivo.

Por Fim, é só extrair o Resultado:
Reader.result;
*/