class Unit {
    ID;
    constructor(id) {
        this.ID = id;
    }
}

class UnitList {
    Units;

    constructor() {
        this.Units = new Array();
    }

    GetReferencesByIDArray(ID_Array) {
        let Output = new Array();
        for (let i = 0; i < this.Units.length; i++) {
            if (ID_Array.length == 0) {
                break;
            }

            let Current_Unit = this.Units[i];

            for (let l = 0; l < ID_Array.length; l++) {
                if (Current_Unit.ID == ID_Array[l]) {
                    Output.push(Current_Unit);
                    ID_Array.splice(l, 1);
                    break;
                }
            }
        }

        return Output;
    }

    GetReferencesByIDArrayOrder(ID_Array) {
        let Output = new Array(ID_Array.length);
        let Indexes = new Array();

        for (let i = 0; i < ID_Array.length; i++) {
            Indexes.push(i);
        }

        for (let i = 0; i < this.Units.length; i++) {
            if (ID_Array.length == 0) {
                break;
            }

            let Current_Unit = this.Units[i];

            for (let l = 0; l < ID_Array.length; l++) {
                if (Current_Unit.ID == ID_Array[l]) {
                    Output[Indexes[l]] = Current_Unit;
                    ID_Array.splice(l, 1);
                    Indexes.splice(l, 1);
                    break;
                }
            }
        }

        return Output;
    }

    AddUnit(Unit) {
        this.Units.push(Unit);
    }

    length() {
        return this.Units.length;
    }

    get(index) {
        return this.Units[index];
    }
}

class Vector2D extends Unit {
    x;
    y;
    w = 1;

    constructor(x, y, id) {
        super(id);
        this.x = x;
        this.y = y;
    }

    getCopy() {
        let v2d = new Vector2D(this.x, this.y, this.ID);
        v2d.w = this.w;

        return v2d;
    }
}

class Vector3D extends Vector2D {
    z;

    constructor(x, y, z, id) {
        super(x, y, id);
        this.z = z;
    }

    getCopy() {
        let v3d = new Vector3D(this.x, this.y, this.z, this.ID);
        v3d.w = this.w;

        return v3d;
    }
}

class ConnectionTriangle extends Unit {
    //Vectors
    VID_1 = 0;
    VID_2 = 0;
    VID_3 = 0;
    //Texture
    TID_1 = 0;
    TID_2 = 0;
    TID_3 = 0;

    constructor(vid1, vid2, vid3, tid1, tid2, tid3, ID) {
        super(ID);
        this.VID_1 = vid1;
        this.VID_2 = vid2;
        this.VID_3 = vid3;

        this.TID_1 = tid1;
        this.TID_2 = tid2;
        this.TID_3 = tid3;
    }
}

class ReferenceTriangle extends Unit {
    //Vectors
    V1;
    V2;
    V3;
    //Textures
    T1;
    T2;
    T3;

    constructor(v1, v2, v3, t1, t2, t3, ID) {
        super(ID);
        //Vectors
        this.V1 = v1;
        this.V2 = v2;
        this.V3 = v3;
        //Textures
        this.T1 = t1;
        this.T2 = t2;
        this.T3 = t3;
    }

    InvertFace(){
        let Temporary_V = this.V2;
        let Temporary_T = this.T2;

        this.V2 = this.V3;
        this.T2 = this.T3;

        this.V3 = Temporary_V;
        this.T3 = Temporary_T;
    }
}

class Mesh extends Unit {
    //Pre Running
    Space_Vectors;
    Texture_Vectors;

    Connection_Triangles;

    //Pre Processing
    Position_Translation = new Vector3D(0,0,0,0);

    Reference_Triangles;

    ImageData;

    constructor(id,x,y,z) {
        super(id);
        this.Position_Translation = new Vector3D(x,y,z,0);
        this.Space_Vectors = new UnitList();
        this.Texture_Vectors = new UnitList();

        this.Connection_Triangles = new UnitList();
        this.Reference_Triangles = new UnitList();
    }

    AddSpaceVector(x, y, z, ID) {
        this.Space_Vectors.AddUnit(new Vector3D(x, y, z, ID));
    }

    AddTextureVector(x, y, ID) {
        this.Texture_Vectors.AddUnit(new Vector2D(x, y, ID));
    }

    AddConnectionTriangle(vid1, vid2, vid3, tid1, tid2, tid3, ID) {
        this.Connection_Triangles.AddUnit(new ConnectionTriangle(vid1, vid2, vid3, tid1, tid2, tid3, ID));
    }

    Translate(){
        for(let i = 0;i<this.Space_Vectors.Units.length;i++){
            let Current = VectorCalculator.Add_3D(this.Position_Translation,this.Space_Vectors.Units[i]);
            Current.ID = this.Space_Vectors.Units[i].ID;

            this.Space_Vectors.Units[i] = Current;
        }
    }

    BuildReferenceTriangles() {
        for (let i = 0; i < this.Connection_Triangles.length(); i++) {
            let CurrentConnection = this.Connection_Triangles.get(i);

            let SpaceVectorsIDs = [CurrentConnection.VID_1, CurrentConnection.VID_2, CurrentConnection.VID_3];

            let CSpaceVectors = this.Space_Vectors.GetReferencesByIDArrayOrder(SpaceVectorsIDs);

            let TextureVectorsIDs = [CurrentConnection.TID_1, CurrentConnection.TID_2, CurrentConnection.TID_3];

            let CTextureVectors = this.Texture_Vectors.GetReferencesByIDArrayOrder(TextureVectorsIDs);

            let RefTri = new ReferenceTriangle(CSpaceVectors[0], CSpaceVectors[1], CSpaceVectors[2], CTextureVectors[0], CTextureVectors[1], CTextureVectors[2], CurrentConnection.ID);

            this.Reference_Triangles.AddUnit(RefTri);
        }
    }

    Initialize(){
        this.Translate();
        this.BuildReferenceTriangles();
    }

}

class Matrix {
    m = new Array();

    Rows = 0;
    Columns = 0;

    constructor(Rows, Columns) {
        this.Rows = Rows;
        this.Columns = Columns;
        this.m = new Array();
        for (let i = 0; i < Rows; i++) {
            this.m.push(new Array());
            for (let l = 0; l < Columns; l++) {
                this.m[i].push(0);
            }
        }
    }

    printself() {
        for (let r = 0; r < this.m.length; r++) {
            console.log(this.m[r]);
        }
    }
}

class Camera{
    Position = new Vector3D(0,0,0,0);

    Sidewards = new Vector3D(1,0,0,0);
    Upwards   = new Vector3D(0,1,0,0);
    Fowards   = new Vector3D(0,0,1,0);

    Walk_Step  = 1;
    Walk_Speed = 1;

    Angle_XZ = [0,0];
    Angle_YZ = [0,0];
    Angle_XY = [0,0];

    Matrix_XZ;
    Matrix_YZ;
    Matrix_XY;

    Look_Step  = 1;
    Look_Speed = 1;

    constructor(X,Y,Z){
        this.Position = new Vector3D(X,Y,Z,0);

        this.Fowards = new Vector3D(0,0,1,0);
        this.Sidewards = new Vector3D(1,0,0,0);

        this.Walk_Step = 1;
        this.Walk_Speed = 1;

        //[0] = Current ; [1] = Last 
        this.Angle_XZ = [0,0];
        this.Angle_YZ = [0,0];
        this.Angle_XY = [0,0];

        this.Matrix_XZ = MatrixCalculator.MakeIdentity();
        this.Matrix_YZ = MatrixCalculator.MakeIdentity();
        this.Matrix_XY = MatrixCalculator.MakeIdentity();

        this.Look_Step = 1;
        this.Look_Speed = 1;
    }

    Calculate_LookMatrix(){
        //If it is not the Same Angle as Before:
        if(this.Angle_XZ[0] != this.Angle_XZ[1]){
            //Calculate The Matrix With the Current Angle
            this.Matrix_XZ = MatrixCalculator.MakeRotationY((this.Angle_XZ[0] * Math.PI) / 180);
            //Then Update the last Angle, to the Current One.
            this.Angle_XZ[1] = this.Angle_XZ[0];
        }
        if(this.Angle_YZ[0] != this.Angle_YZ[1]){
            this.Matrix_YZ = MatrixCalculator.MakeRotationX((this.Angle_YZ[0] * Math.PI) / 180);
            this.Angle_YZ[1] = this.Angle_YZ[0];
        }
        if(this.Angle_XY[0] != this.Angle_XY[1]){
            this.Matrix_XY = MatrixCalculator.MakeRotationZ((this.Angle_XY[0] * Math.PI) / 180);
            this.Angle_XY[1] = this.Angle_XY[0];
        }
    }

    Calculate_BasicMovementDirection(){
        let Front = new Vector3D(0,0,1,0);
        let Side = new Vector3D(1,0,0,0);
        this.Fowards = MatrixCalculator.MultiplyVector(this.Matrix_XZ,Front);
        this.Sidewards = MatrixCalculator.MultiplyVector(this.Matrix_XZ,Side);
    }

    Calculate_BasicPointAt(Front,Up){
        //Camera_Position, Camera_Forward, Camera_Upwards
        let Forward_Direction = VectorCalculator.Sub_3D(Front, this.Position);
        Forward_Direction = VectorCalculator.Normalize_3D(Forward_Direction);

        let Forward_Correction = VectorCalculator.Mul_Value_3D(Forward_Direction, VectorCalculator.DotProduct_3D(Up, Forward_Direction));
        let Up_Direction = VectorCalculator.Sub_3D(Up, Forward_Correction);
        Up_Direction = VectorCalculator.Normalize_3D(Up_Direction);

        let Right_Direction = VectorCalculator.CrossProduct_3D(Up_Direction, Forward_Direction);

        let OutputMatrix = new Matrix(4, 4);
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

        OutputMatrix.m[3][0] = this.Position.x;
        OutputMatrix.m[3][1] = this.Position.y;
        OutputMatrix.m[3][2] = this.Position.z;
        OutputMatrix.m[3][3] = 1.0;

        return OutputMatrix;
    }

    Calculate_BasicViewSpace(){
        let MasterMatrix = MatrixCalculator.MultiplyMatrix4x4(this.Matrix_XZ,this.Matrix_YZ);
        //MasterMatrix = MatrixCalculator.MultiplyMatrix4x4(MasterMatrix,this.Matrix_XY);

        let Front = new Vector3D(0,0,1,0);
        let Up    = new Vector3D(0,1,0,0);

        let LookDir = MatrixCalculator.MultiplyVector(MasterMatrix,Front);
        //let UnderDir = MatrixCalculator.MultiplyVector(MasterMatrix,Up);

        Front = VectorCalculator.Add_3D(this.Position,LookDir);
        //Up = VectorCalculator.Add_3D(this.Position,UnderDir);

        let Camera_Matrix = this.Calculate_BasicPointAt(Front,Up);

        let ViewMatrix = MatrixCalculator.QuickInverse4x4(Camera_Matrix);
        
        return ViewMatrix;
    }

    Move_Foward(){
        let Distance = this.Walk_Step * this.Walk_Speed;
        let ToWalk = VectorCalculator.Mul_Value_3D(this.Fowards,Distance);
        this.Position = VectorCalculator.Add_3D(this.Position,ToWalk);
    }

    Move_Backward(){
        let Distance = this.Walk_Step * this.Walk_Speed;
        let ToWalk = VectorCalculator.Mul_Value_3D(this.Fowards,Distance);
        this.Position = VectorCalculator.Sub_3D(this.Position,ToWalk);
    }

    Move_Rightward(){
        let Distance = this.Walk_Step * this.Walk_Speed;
        let ToWalk = VectorCalculator.Mul_Value_3D(this.Sidewards,Distance);
        this.Position = VectorCalculator.Add_3D(this.Position,ToWalk);
    }

    Move_Leftward(){
        let Distance = this.Walk_Step * this.Walk_Speed;
        let ToWalk = VectorCalculator.Mul_Value_3D(this.Sidewards,Distance);
        this.Position = VectorCalculator.Sub_3D(this.Position,ToWalk);
    }

    Move_Upward(){
        let Distance = this.Walk_Step * this.Walk_Speed;
        let ToWalk = VectorCalculator.Mul_Value_3D(this.Upwards,Distance);
        this.Position = VectorCalculator.Add_3D(this.Position,ToWalk);
    }

    Move_Downward(){
        let Distance = this.Walk_Step * this.Walk_Speed;
        let ToWalk = VectorCalculator.Mul_Value_3D(this.Upwards,Distance);
        this.Position = VectorCalculator.Sub_3D(this.Position,ToWalk);
    }

    Look_Rightward(){
        let LookAngle = this.Look_Step * this.Look_Speed;
        this.Angle_XZ[0] += LookAngle;

        if(this.Angle_XZ[0] > 360){
            this.Angle_XZ[0] = this.Angle_XZ[0] - 360;
        }
    }

    Look_Leftward(){
        let LookAngle = this.Look_Step * this.Look_Speed;
        this.Angle_XZ[0] -= LookAngle;

        if(this.Angle_XZ[0] < 0){
            this.Angle_XZ[0] = this.Angle_XZ[0] + 360;
        }
    }

    Look_Upward(){
        let LookAngle = this.Look_Step * this.Look_Speed;
        this.Angle_YZ[0] += LookAngle;

        if(this.Angle_YZ[0] > 360){
            this.Angle_YZ[0] = this.Angle_YZ[0] - 360;
        }
    }

    Look_Downward(){
        let LookAngle = this.Look_Step * this.Look_Speed;
        this.Angle_YZ[0] -= LookAngle;

        if(this.Angle_YZ[0] < 0){
            this.Angle_YZ[0] = this.Angle_YZ[0] + 360;
        }
    }

    Look_Clockwise(){
        let LookAngle = this.Look_Step * this.Look_Speed;
        this.Angle_XY[0] += LookAngle;

        if(this.Angle_XY[0] > 360){
            this.Angle_XY[0] = this.Angle_XY[0] - 360;
        }
    }

    Look_CounterClockwise(){
        let LookAngle = this.Look_Step * this.Look_Speed;
        this.Angle_XY[0] -= LookAngle;

        if(this.Angle_XY[0] < 0){
            this.Angle_XY[0] = this.Angle_XY[0] + 360;
        }
    }
}

class VectorCalculator {
    static Add_3D(Vector_1, Vector_2) {
        let Vec = new Vector3D(0, 0, 0, 0);

        Vec.x = Vector_1.x + Vector_2.x;
        Vec.y = Vector_1.y + Vector_2.y;
        Vec.z = Vector_1.z + Vector_2.z;

        return Vec;
    }

    static Add_2D(Vector_1, Vector_2) {
        let Vec = new Vector2D(0, 0, 0);

        Vec.x = Vector_1.x + Vector_2.x;
        Vec.y = Vector_1.y + Vector_2.y;

        return Vec;
    }

    static Sub_3D(Vector_1, Vector_2) {
        let Vec = new Vector3D(0, 0, 0, 0);

        Vec.x = Vector_1.x - Vector_2.x;
        Vec.y = Vector_1.y - Vector_2.y;
        Vec.z = Vector_1.z - Vector_2.z;

        return Vec;
    }

    static Sub_2D(Vector_1, Vector_2) {
        let Vec = new Vector2D(0, 0, 0);

        Vec.x = Vector_1.x - Vector_2.x;
        Vec.y = Vector_1.y - Vector_2.y;

        return Vec;
    }

    static Mul_3D(Vector_1, Vector_2) {
        let Vec = new Vector3D(0, 0, 0, 0);

        Vec.x = Vector_1.x * Vector_2.x;
        Vec.y = Vector_1.y * Vector_2.y;
        Vec.z = Vector_1.z * Vector_2.z;

        return Vec;
    }

    static Mul_2D(Vector_1, Vector_2) {
        let Vec = new Vector2D(0, 0, 0);

        Vec.x = Vector_1.x * Vector_2.x;
        Vec.y = Vector_1.y * Vector_2.y;

        return Vec;
    }

    static Div_3D(Vector_1, Vector_2) {
        let Vec = new Vector3D(0, 0, 0, 0);

        Vec.x = Vector_1.x / Vector_2.x;
        Vec.y = Vector_1.y / Vector_2.y;
        Vec.z = Vector_1.z / Vector_2.z;

        return Vec;
    }

    static Div_2D(Vector_1, Vector_2) {
        let Vec = new Vector2D(0, 0, 0);

        Vec.x = Vector_1.x / Vector_2.x;
        Vec.y = Vector_1.y / Vector_2.y;

        return Vec;
    }

    static Add_Value_3D(Vector, Value) {
        let Vec = new Vector3D(0, 0, 0, Vector.ID);

        Vec.x = Vector.x + Value;
        Vec.y = Vector.y + Value;
        Vec.z = Vector.z + Value;

        return Vec;
    }

    static Add_Value_2D(Vector, Value) {
        let Vec = new Vector2D(0, 0, Vector.ID);

        Vec.x = Vector.x + Value;
        Vec.y = Vector.y + Value;

        return Vec;
    }

    static Sub_Value_3D(Vector, Value) {
        let Vec = new Vector3D(0, 0, 0, Vector.ID);

        Vec.x = Vector.x - Value;
        Vec.y = Vector.y - Value;
        Vec.z = Vector.z - Value;

        return Vec;
    }

    static Sub_Value_2D(Vector, Value) {
        let Vec = new Vector2D(0, 0, Vector.ID);

        Vec.x = Vector.x - Value;
        Vec.y = Vector.y - Value;

        return Vec;
    }

    static Mul_Value_3D(Vector, Value) {
        let Vec = new Vector3D(0, 0, 0, Vector.ID);

        Vec.x = Vector.x * Value;
        Vec.y = Vector.y * Value;
        Vec.z = Vector.z * Value;

        return Vec;
    }

    static Mul_Value_2D(Vector, Value) {
        let Vec = new Vector2D(0, 0, Vector.ID);

        Vec.x = Vector.x * Value;
        Vec.y = Vector.y * Value;

        return Vec;
    }

    static Div_Value_3D(Vector, Value) {
        let Vec = new Vector3D(0, 0, 0, Vector.ID);

        Vec.x = Vector.x / Value;
        Vec.y = Vector.y / Value;
        Vec.z = Vector.z / Value;

        return Vec;
    }

    static Div_Value_2D(Vector, Value) {
        let Vec = new Vector2D(0, 0, Vector.ID);

        Vec.x = Vector.x / Value;
        Vec.y = Vector.y / Value;

        return Vec;
    }

    static DotProduct_3D(Vector_1, Vector_2) {
        let VX = Vector_1.x * Vector_2.x;
        let VY = Vector_1.y * Vector_2.y;
        let VZ = Vector_1.z * Vector_2.z;

        let Output = VX + VY + VZ;

        return Output;

        //Basic Definition:
        /*
        Returns a Value Representing How Aligned Two Vectors Are.
        Being:
        > 0 : in the Same sense of Direction
        = 0 : Perpendicular
        < 0 : in the Opposite sense of Direction
        */

        //Example 1 (> 0):
        /*
        v: (x,y,z)
        v0: (0,0,0)

        v1: (1,0,0)
        v2: (1,1,0)

            v2
           /
        v0/___v1

        v1*v2 = (1,0,0)
        1+0+0 = 1
        1 > 0 : in the Same sense of direction.

        */

        //Example 2 (= 0):
        /*
        v: (x,y,z)
        v0: (0,0,0)

        v1: (1,0,0)
        v2: (0,1,0)

          v2
          |
        v0|___v1

        v1*v2 = (0,0,0)
        0+0+0 = 0
        0 = 0 : Perpendicular

        */

        //Example 3 (< 0):
        /*
        v: (x,y,z)
        v0: (0,0,0)

        v1: (1,0,0)
        v2: (-1,0,0)

        v2___v0___v1

        v1*v2 = (-1,0,0)
        -1+0+0 = -1
        -1 < 0 : in the Opposite sense of direction.
        */
    }

    static Length_3D(Vector) {
        let VX = Vector.x * Vector.x;
        let VY = Vector.y * Vector.y;
        let VZ = Vector.z * Vector.z;

        let VXYZ = VX + VY + VZ;

        return Math.sqrt(VXYZ);

        //Vector Length, AKA Vector Module, is the Size of The Line Between The Origin, and the Vector's End
        // L = √(x²+y²+z²)

        //Example (0 to V):
        /*
        v = (x,y,z)

        O(Origin) = (0,0,0)

        V(Vector) = (2,3,0)
           
        |   V
        |  /
        | /
        |/
        O_____

        Length = √(2² + 3² + 0²)
        Length = √(4 + 9 + 0)
        Length = √(13)
        Length = 3,60

        */
    }

    static Normalize_3D(Vector) {
        let Length = VectorCalculator.Length_3D(Vector);
        let Norm = new Vector3D(0, 0, 0, 0);

        Norm.x = Vector.x / Length;
        Norm.y = Vector.y / Length;
        Norm.z = Vector.z / Length;

        return Norm;

        //A Vector Normalization, turns a vector with any range,into a vector with a maximum range of 1

        //Example:
        /*

        v = (x,y,z)
        v0 = (0,0,0)

        V = (3,3,0)
        |     V
        |    /
        |   /
        |  /
        |v0_______

        Length = √(3² + 3² + 0²)
        Length = √(9 + 9 + 0)
        Length = √(18)
        Length = ~4,25

        N = (3 / 4,25 , 3 / 4,25 , 0 / 4,25)
        N = (~0,706,~0,706,0)

        |     
        |    
        |   N
        |  /
        |v0_______
        */
    }

    static Normalize_Relative_3D(Normal, Relative_Point) {
        let Line = VectorCalculator.Sub_3D(Normal, Relative_Point);

        let Length = VectorCalculator.Length_3D(Line);

        let Output = new Vector3D(0, 0, 0, Normal.ID);

        Output.x += Line.x / Length;
        Output.y += Line.y / Length;
        Output.z += Line.z / Length;

        return Output;
    }

    static CrossProduct_3D(Vector_1, Vector_2) {
        let OutputVector = new Vector3D();
        OutputVector.x = Vector_1.y * Vector_2.z - Vector_1.z * Vector_2.y;
        OutputVector.y = Vector_1.z * Vector_2.x - Vector_1.x * Vector_2.z;
        OutputVector.z = Vector_1.x * Vector_2.y - Vector_1.y * Vector_2.x;
        return OutputVector;
    }

    static Intersection_3D(Plane_Point, Plane_Normal, lineStart, lineEnd) {
        //The Normal Should Be Normalized
        let Plane_DotProduct = VectorCalculator.DotProduct_3D(Plane_Normal, Plane_Point);
        let Start_Normal_DotProduct = VectorCalculator.DotProduct_3D(lineStart, Plane_Normal);
        let End_Normal_DotProduct = VectorCalculator.DotProduct_3D(lineEnd, Plane_Normal);
        let Intersection = (Plane_DotProduct - Start_Normal_DotProduct) / (End_Normal_DotProduct - Start_Normal_DotProduct);

        return Intersection;
    }

    static Point_In_Line_3D(lineStart, lineEnd, Value) {
        let lineStartToEnd = VectorCalculator.Sub_3D(lineEnd, lineStart);
        let lineToIntersect = VectorCalculator.Mul_Value_3D(lineStartToEnd, Value);

        return VectorCalculator.Add_3D(lineStart, lineToIntersect);
    }

    static Point_In_Line_2D(lineStart, lineEnd, Value) {
        let lineStartToEnd = VectorCalculator.Sub_2D(lineEnd, lineStart);
        let lineToIntersect = VectorCalculator.Mul_Value_2D(lineStartToEnd, Value);
        let Output = VectorCalculator.Add_2D(lineStart, lineToIntersect);

        Output.w = Value * (lineEnd.w - lineStart.w) + lineStart.w;

        return Output;
    }

    static Insideness_3D(Plane_Normal, Plane_DotProduct, Vector) {
        let X = Plane_Normal.x * Vector.x;
        let Y = Plane_Normal.y * Vector.y;
        let Z = Plane_Normal.z * Vector.z;

        return X + Y + Z - Plane_DotProduct;
    }

    static Calculate_Normal_3D(Vector_1, Vector_2, Vector_3) {
        let Line_1 = VectorCalculator.Sub_3D(Vector_2, Vector_1);
        let Line_2 = VectorCalculator.Sub_3D(Vector_3, Vector_1);
        let Normal = VectorCalculator.CrossProduct_3D(Line_1, Line_2);
        let Normal_Length = VectorCalculator.Length_3D(Normal);

        Normal.x /= Normal_Length;
        Normal.y /= Normal_Length;
        Normal.z /= Normal_Length;

        return Normal;
    }
}

class TriangleCalculator {
    static ClipAgainstPlane(Plane_Point, Plane_Normal, Triangle) {
        //For Good Understanding
        let Original_V_1 = Triangle.V1;
        let Original_V_2 = Triangle.V2;
        let Original_V_3 = Triangle.V3;

        let Original_T_1 = Triangle.T1;
        let Original_T_2 = Triangle.T2;
        let Original_T_3 = Triangle.T3;

        /*
        The Normal Should not be Relative to the plane current position
        it should represent the Direction of the normal, of the plane

        So, if the point is at 4,0,0
        and the normal at 3,0,0

        it does not mean that it is pointing at the Left of the Screen (3-4 = -1)
        it actually means that it is pointing to the Right (4+3 = 7)
        */

        //let NormalizedNormal = VectorCalculator.Normalize_Relative_3D(Plane_Normal,Plane_Point);
        let NormalizedNormal = VectorCalculator.Normalize_3D(Plane_Normal);

        let DotProduct = VectorCalculator.DotProduct_3D(NormalizedNormal, Plane_Point);

        let Inside_Vectors = new Array();
        let Outside_Vectors = new Array();

        let Inside_Textures = new Array();
        let Outside_Textures = new Array();

        if (VectorCalculator.Insideness_3D(NormalizedNormal, DotProduct, Original_V_1) >= 0) {
            Inside_Vectors.push(Original_V_1);
            Inside_Textures.push(Original_T_1);
        }
        else {
            Outside_Vectors.push(Original_V_1);
            Outside_Textures.push(Original_T_1);
        }

        if (VectorCalculator.Insideness_3D(NormalizedNormal, DotProduct, Original_V_2) >= 0) {
            Inside_Vectors.push(Original_V_2);
            Inside_Textures.push(Original_T_2);
        }
        else {
            Outside_Vectors.push(Original_V_2);
            Outside_Textures.push(Original_T_2);
        }

        if (VectorCalculator.Insideness_3D(NormalizedNormal, DotProduct, Original_V_3) >= 0) {
            Inside_Vectors.push(Original_V_3);
            Inside_Textures.push(Original_T_3);
        }
        else {
            Outside_Vectors.push(Original_V_3);
            Outside_Textures.push(Original_T_3);
        }

        let Output = new Array();

        //For The Switch
        let New_Point_1;
        let New_Point_2;

        let New_Texture_1;
        let New_Texture_2;

        let Intersection1;
        let Intersection2;

        switch (Inside_Vectors.length) {
            //All The Vectors Lie inside the Plane
            case 3:
                Output.push(Triangle);
                break;

            //Only Two of The Vectors Lies Inside The Plane
            case 2:
                let Inside_Point_1 = Inside_Vectors[0];
                let Inside_Point_2 = Inside_Vectors[1];
                let Outside_Point = Outside_Vectors[0];

                let Inside_Texture_1 = Inside_Textures[0];
                let Inside_Texture_2 = Inside_Textures[1];
                let Outside_Texture = Outside_Textures[0];

                Intersection1 = VectorCalculator.Intersection_3D(Plane_Point, NormalizedNormal, Inside_Point_1, Outside_Point);
                Intersection2 = VectorCalculator.Intersection_3D(Plane_Point, NormalizedNormal, Inside_Point_2, Outside_Point);

                New_Point_1 = VectorCalculator.Point_In_Line_3D(Inside_Point_1, Outside_Point, Intersection1);
                New_Point_2 = VectorCalculator.Point_In_Line_3D(Inside_Point_2, Outside_Point, Intersection2);

                New_Texture_1 = VectorCalculator.Point_In_Line_2D(Inside_Texture_1, Outside_Texture, Intersection1);
                New_Texture_2 = VectorCalculator.Point_In_Line_2D(Inside_Texture_2, Outside_Texture, Intersection2);

                Output.push(new ReferenceTriangle(Inside_Point_1, Inside_Point_2, New_Point_1, Inside_Texture_1, Inside_Texture_2, New_Texture_1, 0));
                Output.push(new ReferenceTriangle(Inside_Point_2, New_Point_1, New_Point_2, Inside_Texture_2, New_Texture_1, New_Texture_2));
                break;

            //Only One Vector Lie inside the Plane
            case 1:
                let Inside_Point = Inside_Vectors[0];
                let Outside_Point_1 = Outside_Vectors[0];
                let Outside_Point_2 = Outside_Vectors[1];

                let Inside_Texture = Inside_Textures[0];
                let Outside_Texture_1 = Outside_Textures[0];
                let Outside_Texture_2 = Outside_Textures[1];

                Intersection1 = VectorCalculator.Intersection_3D(Plane_Point, NormalizedNormal, Inside_Point, Outside_Point_1);
                Intersection2 = VectorCalculator.Intersection_3D(Plane_Point, NormalizedNormal, Inside_Point, Outside_Point_2);

                New_Point_1 = VectorCalculator.Point_In_Line_3D(Inside_Point, Outside_Point_1, Intersection1);
                New_Point_2 = VectorCalculator.Point_In_Line_3D(Inside_Point, Outside_Point_2, Intersection2);

                New_Texture_1 = VectorCalculator.Point_In_Line_2D(Inside_Texture, Outside_Texture_1, Intersection1);
                New_Texture_2 = VectorCalculator.Point_In_Line_2D(Inside_Texture, Outside_Texture_2, Intersection2);

                Output.push(new ReferenceTriangle(Inside_Point, New_Point_1, New_Point_2, Inside_Texture, New_Texture_1, New_Texture_2, 0));

                break;

            //No Vectors Inside The Plane
            case 0:
                break;
        }

        return Output;
    }

    static ClipAgainsScreen(Screen_Width, Screen_Heigth, Projected_Triangle) {
        let Clipped_Triangles = new Array();

        let TL_Corner = new Vector3D(0, 0, 0, 0);//0,0,0
        let T_Normal = new Vector3D(0, 0, 0, 0);//0,1,0

        let L_Normal = new Vector3D(0, 0, 0, 0);//1,0,0

        let BL_Corner = new Vector3D(0, 0, 0, 0);//0,H-1,0
        let B_Normal = new Vector3D(0, 0, 0, 0);//0,-1,0

        let TR_Corner = new Vector3D(0, 0, 0, 0);//W-1,0,0
        let R_Normal = new Vector3D(0, 0, 0, 0);//-1,0,0

        T_Normal.y = 1;
        L_Normal.x = 1;
        BL_Corner.y = Screen_Heigth - 1;
        B_Normal.y = -1;
        TR_Corner.x = Screen_Width - 1;
        R_Normal.x = -1;

        Clipped_Triangles = TriangleCalculator.ClipAgainstPlane(TL_Corner, T_Normal, Projected_Triangle);

        function ClipAgainstScreenPlane(PlanePoint, PlaneNormal, Clipped_Tri_List) {
            let Newly_ClippedTriangles = new Array();

            for (let i = 0; i < Clipped_Tri_List.length; i++) {
                let New_Batch = TriangleCalculator.ClipAgainstPlane(PlanePoint, PlaneNormal, Clipped_Tri_List[i]);

                for (let l = 0; l < New_Batch.length; l++) {
                    Newly_ClippedTriangles.push(New_Batch[l]);
                }
            }

            return Newly_ClippedTriangles;
        }

        Clipped_Triangles = ClipAgainstScreenPlane(TL_Corner, L_Normal, Clipped_Triangles);

        Clipped_Triangles = ClipAgainstScreenPlane(BL_Corner, B_Normal, Clipped_Triangles);

        Clipped_Triangles = ClipAgainstScreenPlane(TR_Corner, R_Normal, Clipped_Triangles);

        return Clipped_Triangles;
    }

    static ClipMultipleAgainstScreen(Screen_Width, Screen_Heigth, Projected_Triangles){
        let Clipped_Triangles = new Array();

        let TL_Corner = new Vector3D(0, 0, 0, 0);//0,0,0
        let T_Normal = new Vector3D(0, 0, 0, 0);//0,1,0

        let L_Normal = new Vector3D(0, 0, 0, 0);//1,0,0

        let BL_Corner = new Vector3D(0, 0, 0, 0);//0,H-1,0
        let B_Normal = new Vector3D(0, 0, 0, 0);//0,-1,0

        let TR_Corner = new Vector3D(0, 0, 0, 0);//W-1,0,0
        let R_Normal = new Vector3D(0, 0, 0, 0);//-1,0,0

        T_Normal.y = 1;
        L_Normal.x = 1;
        BL_Corner.y = Screen_Heigth - 1;
        B_Normal.y = -1;
        TR_Corner.x = Screen_Width - 1;
        R_Normal.x = -1;

        function ClipAgainstScreenPlane(PlanePoint, PlaneNormal, Clipped_Tri_List) {
            let Newly_ClippedTriangles = new Array();

            for (let i = 0; i < Clipped_Tri_List.length; i++) {
                let New_Batch = TriangleCalculator.ClipAgainstPlane(PlanePoint, PlaneNormal, Clipped_Tri_List[i]);

                for (let l = 0; l < New_Batch.length; l++) {
                    Newly_ClippedTriangles.push(New_Batch[l]);
                }
            }

            return Newly_ClippedTriangles;
        }

        Clipped_Triangles = ClipAgainstScreenPlane(TL_Corner, T_Normal, Projected_Triangles);

        Clipped_Triangles = ClipAgainstScreenPlane(TL_Corner, L_Normal, Clipped_Triangles);
    
        Clipped_Triangles = ClipAgainstScreenPlane(BL_Corner, B_Normal, Clipped_Triangles);
    
        Clipped_Triangles = ClipAgainstScreenPlane(TR_Corner, R_Normal, Clipped_Triangles);

        return Clipped_Triangles;
    }

    static SplitTriangle(Plane_Point, Plane_Normal, Triangle) {
        //For Good Understanding
        let Original_V_1 = Triangle.V1;
        let Original_V_2 = Triangle.V2;
        let Original_V_3 = Triangle.V3;

        let Original_T_1 = Triangle.T1;
        let Original_T_2 = Triangle.T2;
        let Original_T_3 = Triangle.T3;

        let Clockwise = TriangleCalculator.IsClockwise(Triangle);

        let NormalizedNormal = VectorCalculator.Normalize_3D(Plane_Normal);

        let DotProduct = VectorCalculator.DotProduct_3D(NormalizedNormal, Plane_Point);

        let Inside_Vectors = new Array();
        let Outside_Vectors = new Array();

        let Inside_Textures = new Array();
        let Outside_Textures = new Array();

        if (VectorCalculator.Insideness_3D(NormalizedNormal, DotProduct, Original_V_1) >= 0) {
            Inside_Vectors.push(Original_V_1);
            Inside_Textures.push(Original_T_1);
        }
        else {
            Outside_Vectors.push(Original_V_1);
            Outside_Textures.push(Original_T_1);
        }

        if (VectorCalculator.Insideness_3D(NormalizedNormal, DotProduct, Original_V_2) >= 0) {
            Inside_Vectors.push(Original_V_2);
            Inside_Textures.push(Original_T_2);
        }
        else {
            Outside_Vectors.push(Original_V_2);
            Outside_Textures.push(Original_T_2);
        }

        if (VectorCalculator.Insideness_3D(NormalizedNormal, DotProduct, Original_V_3) >= 0) {
            Inside_Vectors.push(Original_V_3);
            Inside_Textures.push(Original_T_3);
        }
        else {
            Outside_Vectors.push(Original_V_3);
            Outside_Textures.push(Original_T_3);
        }

        let Inside_Output = new Array();
        let Outside_Output = new Array();
        let Output = new Array();

        //For The Switch
        let New_Point_1;
        let New_Point_2;

        let New_Texture_1;
        let New_Texture_2;

        let Intersection1;
        let Intersection2;

        switch (Inside_Vectors.length) {
            //All The Vectors Lie inside the Plane
            case 3:
                Inside_Output.push(Triangle);
                break;

            //Only Two of The Vectors Lies Inside The Plane
            case 2:
                let Inside_Point_1 = Inside_Vectors[0];
                let Inside_Point_2 = Inside_Vectors[1];
                let Outside_Point = Outside_Vectors[0];

                let Inside_Texture_1 = Inside_Textures[0];
                let Inside_Texture_2 = Inside_Textures[1];
                let Outside_Texture = Outside_Textures[0];

                Intersection1 = VectorCalculator.Intersection_3D(Plane_Point, NormalizedNormal, Inside_Point_1, Outside_Point);
                Intersection2 = VectorCalculator.Intersection_3D(Plane_Point, NormalizedNormal, Inside_Point_2, Outside_Point);

                New_Point_1 = VectorCalculator.Point_In_Line_3D(Inside_Point_1, Outside_Point, Intersection1);
                New_Point_2 = VectorCalculator.Point_In_Line_3D(Inside_Point_2, Outside_Point, Intersection2);

                New_Texture_1 = VectorCalculator.Point_In_Line_2D(Inside_Texture_1, Outside_Texture, Intersection1);
                New_Texture_2 = VectorCalculator.Point_In_Line_2D(Inside_Texture_2, Outside_Texture, Intersection2);

                let InsideTriangle1 = new ReferenceTriangle(Inside_Point_1, New_Point_1, Inside_Point_2, Inside_Texture_1, New_Texture_1, Inside_Texture_2, 1);
                let InsideTriangle2 = new ReferenceTriangle(Inside_Point_2, New_Point_1, New_Point_2, Inside_Texture_2, New_Texture_1, New_Texture_2, 1);
                let OutsideTriangle = new ReferenceTriangle(Outside_Point, New_Point_2.getCopy(), New_Point_1.getCopy(), Outside_Texture, New_Texture_2.getCopy(), New_Texture_1.getCopy(), 2);

                if(!Clockwise){
                    InsideTriangle1.InvertFace();
                    InsideTriangle2.InvertFace();
                    OutsideTriangle.InvertFace();
                }

                Inside_Output.push(InsideTriangle1);
                Inside_Output.push(InsideTriangle2);
                Outside_Output.push(OutsideTriangle);
                
                break;

            //Only One Vector Lie inside the Plane
            case 1:
                let Inside_Point = Inside_Vectors[0];
                let Outside_Point_1 = Outside_Vectors[0];
                let Outside_Point_2 = Outside_Vectors[1];

                let Inside_Texture = Inside_Textures[0];
                let Outside_Texture_1 = Outside_Textures[0];
                let Outside_Texture_2 = Outside_Textures[1];

                Intersection1 = VectorCalculator.Intersection_3D(Plane_Point, NormalizedNormal, Inside_Point, Outside_Point_1);
                Intersection2 = VectorCalculator.Intersection_3D(Plane_Point, NormalizedNormal, Inside_Point, Outside_Point_2);

                New_Point_1 = VectorCalculator.Point_In_Line_3D(Inside_Point, Outside_Point_1, Intersection1);
                New_Point_2 = VectorCalculator.Point_In_Line_3D(Inside_Point, Outside_Point_2, Intersection2);

                New_Texture_1 = VectorCalculator.Point_In_Line_2D(Inside_Texture, Outside_Texture_1, Intersection1);
                New_Texture_2 = VectorCalculator.Point_In_Line_2D(Inside_Texture, Outside_Texture_2, Intersection2);

                let InsideTriangle = new ReferenceTriangle(Inside_Point, New_Point_2, New_Point_1, Inside_Texture, New_Texture_2, New_Texture_1, 1);
                let OutsideTriangle1 = new ReferenceTriangle(Outside_Point_1, New_Point_1.getCopy(), Outside_Point_2, Outside_Texture_1, New_Texture_1.getCopy(), Outside_Texture_2, 2);
                let OutsideTriangle2 = new ReferenceTriangle(Outside_Point_2, New_Point_1.getCopy(), New_Point_2.getCopy(), Outside_Texture_2, New_Texture_1.getCopy(), New_Texture_2.getCopy(), 2);

                if(!Clockwise){
                    InsideTriangle.InvertFace();
                    OutsideTriangle1.InvertFace();
                    OutsideTriangle2.InvertFace();
                }
                
                Inside_Output.push(InsideTriangle);
                Outside_Output.push(OutsideTriangle1);
                Outside_Output.push(OutsideTriangle2);

                break;

            //No Vectors Inside The Plane
            case 0:
                Outside_Output.push(Triangle);
                break;
        }

        Output.push(Inside_Output);
        Output.push(Outside_Output);

        return Output;
    }

    static Project(Screen_Width, Screen_Heigth, Triangle, ProjectionMatrix) {
        Triangle.V1 = MatrixCalculator.MultiplyVector(ProjectionMatrix, Triangle.V1);
        Triangle.V2 = MatrixCalculator.MultiplyVector(ProjectionMatrix, Triangle.V2);
        Triangle.V3 = MatrixCalculator.MultiplyVector(ProjectionMatrix, Triangle.V3);

        //Texture Handling:
        Triangle.T1 = VectorCalculator.Div_Value_2D(Triangle.T1,Triangle.V1.w);
        Triangle.T2 = VectorCalculator.Div_Value_2D(Triangle.T2,Triangle.V2.w);
        Triangle.T3 = VectorCalculator.Div_Value_2D(Triangle.T3,Triangle.V3.w);

        Triangle.T1.w = 1 / Triangle.V1.w;
        Triangle.T2.w = 1 / Triangle.V2.w;
        Triangle.T3.w = 1 / Triangle.V3.w;

        //Testing
        Triangle.V1 = VectorCalculator.Div_Value_3D(Triangle.V1, Triangle.V1.w);
        Triangle.V2 = VectorCalculator.Div_Value_3D(Triangle.V2, Triangle.V2.w);
        Triangle.V3 = VectorCalculator.Div_Value_3D(Triangle.V3, Triangle.V3.w);

        Triangle.V1 = VectorCalculator.Mul_Value_3D(Triangle.V1, -1);
        Triangle.V2 = VectorCalculator.Mul_Value_3D(Triangle.V2, -1);
        Triangle.V3 = VectorCalculator.Mul_Value_3D(Triangle.V3, -1);

        let Offset = new Vector3D(0, 0, 0, 0);
        Offset.x = 1;
        Offset.y = 1;

        Triangle.V1 = VectorCalculator.Add_3D(Triangle.V1, Offset);
        Triangle.V2 = VectorCalculator.Add_3D(Triangle.V2, Offset);
        Triangle.V3 = VectorCalculator.Add_3D(Triangle.V3, Offset);

        Triangle.V1.x *= Screen_Width * 0.5;
        Triangle.V1.y *= Screen_Heigth * 0.5;

        Triangle.V2.x *= Screen_Width * 0.5;
        Triangle.V2.y *= Screen_Heigth * 0.5;

        Triangle.V3.x *= Screen_Width * 0.5;
        Triangle.V3.y *= Screen_Heigth * 0.5;

        return Triangle;
    }

    static IsFacingCamera(Triangle, Camera_Position) {
        let TriNormal = VectorCalculator.Calculate_Normal_3D(Triangle.V1, Triangle.V2, Triangle.V3);
        TriNormal = VectorCalculator.Normalize_3D(TriNormal);

        let CameraRay = VectorCalculator.Sub_3D(Triangle.V1, Camera_Position);

        let DotProduct = VectorCalculator.DotProduct_3D(TriNormal, CameraRay);

        if (DotProduct < 0) {
            return true;
        }
        else {
            return false;
        }
    }

    static DeprecatedIsClockwise(Triangle) {
        //To Understand How This Was Made, Look For 3x3 Matrix Determinant
        let V1 = Triangle.V1;
        let V2 = Triangle.V2;
        let V3 = Triangle.V3;

        //Adding +1, so We Wont Have 0 to Mess up our calculations
        V1 = VectorCalculator.Add_Value_3D(V1, 1);
        V2 = VectorCalculator.Add_Value_3D(V2, 1);
        V3 = VectorCalculator.Add_Value_3D(V3, 1);

        let Part1 = V1.x * ((V2.y * V3.z) - (V3.y * V2.z));
        let Part2 = V1.y * ((V2.x * V3.z) - (V3.x * V2.z));
        let Part3 = V1.z * ((V2.x * V3.y) - (V3.x * V2.y));

        let Result = (Part1 - Part2 + Part3) < 0;

        return Result;
    }

    static IsClockwise(Triangle) {
        //To Understand How This Was Made, Look For 3x3 Matrix Determinant
        let V1 = Triangle.V1;
        let V2 = Triangle.V2;
        let V3 = Triangle.V3;

        //Adding +1, so We Wont Have 0 to Mess up our calculations
        V1 = VectorCalculator.Add_Value_3D(V1, 1);
        V2 = VectorCalculator.Add_Value_3D(V2, 1);
        V3 = VectorCalculator.Add_Value_3D(V3, 1);

        let Calculations = (V2.x-V1.x)*(V3.y-V1.y)-(V3.x-V1.x)*(V2.y-V1.y);

        let Result = Calculations < 0;

        return Result;
    }

    static ApplyViewMatrix(View_Matrix,Triangle){
        let NewTriangle = new ReferenceTriangle();
        NewTriangle.ID = Triangle.ID;

        NewTriangle.T1 = Triangle.T1;
        NewTriangle.T2 = Triangle.T2;
        NewTriangle.T3 = Triangle.T3;

        let NewV1 = MatrixCalculator.MultiplyVector(View_Matrix,Triangle.V1);
        let NewV2 = MatrixCalculator.MultiplyVector(View_Matrix,Triangle.V2);
        let NewV3 = MatrixCalculator.MultiplyVector(View_Matrix,Triangle.V3);

        NewTriangle.V1 = NewV1;
        NewTriangle.V2 = NewV2;
        NewTriangle.V3 = NewV3;

        return NewTriangle;
    }
}

class MeshCalculator {
    static Split(Mesh, Plane_Point, Plane_Normal) {
        //to Be Implemented
        /*
        Concept: i wanted to use the clipping algorithm, and keep the discarded triangles

        so, i would have multiple triangles created by the plane, on a single triangle

        doing so with every triangle on the object, would result with a pile of Discarded triangles
        and a pile of triangles inside the plane.

        then, it would be just a process of making separate objects
        */
    }
}

class MatrixCalculator {
    static MultiplyVector(Matrix_4x4, Vector_3D) {
        let Output = new Vector3D(0, 0, 0, Vector_3D.ID);

        Output.x = Vector_3D.x * Matrix_4x4.m[0][0] + Vector_3D.y * Matrix_4x4.m[1][0] + Vector_3D.z * Matrix_4x4.m[2][0] + Vector_3D.w * Matrix_4x4.m[3][0];
        Output.y = Vector_3D.x * Matrix_4x4.m[0][1] + Vector_3D.y * Matrix_4x4.m[1][1] + Vector_3D.z * Matrix_4x4.m[2][1] + Vector_3D.w * Matrix_4x4.m[3][1];
        Output.z = Vector_3D.x * Matrix_4x4.m[0][2] + Vector_3D.y * Matrix_4x4.m[1][2] + Vector_3D.z * Matrix_4x4.m[2][2] + Vector_3D.w * Matrix_4x4.m[3][2];
        Output.w = Vector_3D.x * Matrix_4x4.m[0][3] + Vector_3D.y * Matrix_4x4.m[1][3] + Vector_3D.z * Matrix_4x4.m[2][3] + Vector_3D.w * Matrix_4x4.m[3][3];

        return Output;
    }

    static MakeIdentity() {
        let Matrix_4x4 = new Matrix(4, 4);
        Matrix_4x4.m[0][0] = 1.0;
        Matrix_4x4.m[1][1] = 1.0;
        Matrix_4x4.m[2][2] = 1.0;
        Matrix_4x4.m[3][3] = 1.0;
        return Matrix_4x4;
    }

    static MakeRotationX(Angle_Rad) {
        //Rotates The Y and Z Axis
        let Matrix_4x4 = new Matrix(4, 4);
        Matrix_4x4.m[0][0] = 1;
        Matrix_4x4.m[1][1] = Math.cos(Angle_Rad);
        Matrix_4x4.m[1][2] = Math.sin(Angle_Rad);
        Matrix_4x4.m[2][1] = -Math.sin(Angle_Rad);
        Matrix_4x4.m[2][2] = Math.cos(Angle_Rad);
        Matrix_4x4.m[3][3] = 1;
        return Matrix_4x4;
    }

    static MakeRotationY(Angle_Rad) {
        //Rotates The X and Z Axis
        let Matrix_4x4 = new Matrix(4, 4);
        Matrix_4x4.m[0][0] = Math.cos(Angle_Rad);
        Matrix_4x4.m[0][2] = Math.sin(Angle_Rad);
        Matrix_4x4.m[2][0] = -Math.sin(Angle_Rad);
        Matrix_4x4.m[1][1] = 1;
        Matrix_4x4.m[2][2] = Math.cos(Angle_Rad);
        Matrix_4x4.m[3][3] = 1;
        return Matrix_4x4;
    }

    static MakeRotationZ(Angle_Rad) {
        //Rotates The X and Y Axis
        let Matrix_4x4 = new Matrix(4, 4);
        Matrix_4x4.m[0][0] = Math.cos(Angle_Rad);
        Matrix_4x4.m[0][1] = Math.sin(Angle_Rad);
        Matrix_4x4.m[1][0] = -Math.sin(Angle_Rad);
        Matrix_4x4.m[1][1] = Math.cos(Angle_Rad);
        Matrix_4x4.m[2][2] = 1;
        Matrix_4x4.m[3][3] = 1;
        return Matrix_4x4;
    }

    static MakeTranslation(x, y, z) {
        //Moves The Vector Around, Specially usefull when Moving the Camera Around
        let Matrix_4x4 = new Matrix(4, 4);
        Matrix_4x4.m[0][0] = 1;
        Matrix_4x4.m[1][1] = 1;
        Matrix_4x4.m[2][2] = 1;
        Matrix_4x4.m[3][3] = 1;
        Matrix_4x4.m[3][0] = x;
        Matrix_4x4.m[3][1] = y;
        Matrix_4x4.m[3][2] = z;
        return Matrix_4x4;
    }

    static MakeProjection(Fov_Degrees, Aspect_Ratio, Near_Distance, Far_Distance) {
        //This Matrix Will Translate 3D to 2D By Using Some Screen and Perseption Parameters
        let Fov_Radians = 1 / Math.tan(Fov_Degrees * 0.5 / 180 * 3.14159);
        let Matrix_4x4 = new Matrix(4, 4);
        Matrix_4x4.m[0][0] = Aspect_Ratio * Fov_Radians;
        Matrix_4x4.m[1][1] = Fov_Radians;
        Matrix_4x4.m[2][2] = Far_Distance / (Far_Distance - Near_Distance);
        Matrix_4x4.m[3][2] = (-Far_Distance * Near_Distance) / (Far_Distance - Near_Distance);
        Matrix_4x4.m[2][3] = 1;
        Matrix_4x4.m[3][3] = 0;

        return Matrix_4x4;
    }

    static MultiplyMatrix4x4(Matrix_1, Matrix_2) {
        //Matrix Multiplication With Another Matrix, Specially Usefull When Needed To Combine 2 Matrices

        let matrix = new Matrix(4, 4);
        for (let c = 0; c < 4; c++) {
            //C For Columns
            for (let r = 0; r < 4; r++) {
                //R For Rows
                let M0 = Matrix_1.m[r][0] * Matrix_2.m[0][c];
                let M1 = Matrix_1.m[r][1] * Matrix_2.m[1][c];
                let M2 = Matrix_1.m[r][2] * Matrix_2.m[2][c];
                let M3 = Matrix_1.m[r][3] * Matrix_2.m[3][c];

                matrix.m[r][c] = M0 + M1 + M2 + M3;
            }
        }
        return matrix;
    }

    static MultiplyMultipleMatrix4x4(ArrayOfMatrix){
        Output = ArrayOfMatrix[0];

        for(let i = 1;i<ArrayOfMatrix.length;i++){
            Output = MatrixCalculator.MultiplyMatrix4x4(Output,ArrayOfMatrix[i]);
        }

        return Output;
    }

    static MultiplyMatrix(Matrix_1, Matrix_2) {
        if (Matrix_1.Columns != Matrix_2.Rows) {
            let Temp = Matrix_1;
            Matrix_1 = Matrix_2;
            Matrix_2 = Temp;
        }

        let ResultingRows = Matrix_1.Rows;
        let ResultingColumns = Matrix_2.Columns;
        let RowsXColumns = Matrix_1.Columns;

        let Result = new Matrix(ResultingRows, ResultingColumns);

        for (let Row = 0; Row < ResultingRows; Row++) {
            for (let Column = 0; Column < ResultingColumns; Column++) {
                for (let X = 0; X < RowsXColumns; X++) {
                    Result.m[Row][Column] += Matrix_1.m[Row][X] * Matrix_2.m[X][Column];
                }
            }
        }

        return Result;
    }

    static QuickInverse4x4(InputMatrix) {
        let OutputMatrix = new Matrix(4, 4);
        OutputMatrix.m[0][0] = InputMatrix.m[0][0]; OutputMatrix.m[0][1] = InputMatrix.m[1][0]; OutputMatrix.m[0][2] = InputMatrix.m[2][0]; OutputMatrix.m[0][3] = 0.0;
        OutputMatrix.m[1][0] = InputMatrix.m[0][1]; OutputMatrix.m[1][1] = InputMatrix.m[1][1]; OutputMatrix.m[1][2] = InputMatrix.m[2][1]; OutputMatrix.m[1][3] = 0.0;
        OutputMatrix.m[2][0] = InputMatrix.m[0][2]; OutputMatrix.m[2][1] = InputMatrix.m[1][2]; OutputMatrix.m[2][2] = InputMatrix.m[2][2]; OutputMatrix.m[2][3] = 0.0;
        OutputMatrix.m[3][0] = -(InputMatrix.m[3][0] * OutputMatrix.m[0][0] + InputMatrix.m[3][1] * OutputMatrix.m[1][0] + InputMatrix.m[3][2] * OutputMatrix.m[2][0]);
        OutputMatrix.m[3][1] = -(InputMatrix.m[3][0] * OutputMatrix.m[0][1] + InputMatrix.m[3][1] * OutputMatrix.m[1][1] + InputMatrix.m[3][2] * OutputMatrix.m[2][1]);
        OutputMatrix.m[3][2] = -(InputMatrix.m[3][0] * OutputMatrix.m[0][2] + InputMatrix.m[3][1] * OutputMatrix.m[1][2] + InputMatrix.m[3][2] * OutputMatrix.m[2][2]);
        OutputMatrix.m[3][3] = 1.0;
        return OutputMatrix;
    }

    static PointAt(Camera_Position, Camera_Forward, Camera_Upwards) {
        let Forward_Direction = VectorCalculator.Sub_3D(Camera_Forward, Camera_Position);
        Forward_Direction = VectorCalculator.Normalize_3D(Forward_Direction);

        let Forward_Correction = VectorCalculator.Mul_Value_3D(Forward_Direction, VectorCalculator.DotProduct_3D(Camera_Upwards, Forward_Direction));
        let Up_Direction = VectorCalculator.Sub_3D(Camera_Upwards, Forward_Correction);
        Up_Direction = VectorCalculator.Normalize_3D(Up_Direction);

        let Right_Direction = VectorCalculator.CrossProduct_3D(Up_Direction, Forward_Direction);

        let OutputMatrix = new Matrix(4, 4);
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

    static ViewSpace(Camera_Position, XZ_Angle, YZ_Angle, WalkStep) {
        let Camera_Y_Rotation_Matrix = MatrixCalculator.MakeRotationY((XZ_Angle * Math.PI) / 180);
        let Camera_X_Rotation_Matrix = MatrixCalculator.MakeRotationX((YZ_Angle * Math.PI) / 180);
        let Camera_XY_Rotation_Matrix = MatrixCalculator.MultiplyMatrix4x4(Camera_X_Rotation_Matrix, Camera_Y_Rotation_Matrix);

        let Up = new Vector3D(0, 1, 0, 0);
        let Target = new Vector3D(0, 0, 1, 0);
        let LookDir = MatrixCalculator.MultiplyVector(Camera_XY_Rotation_Matrix, Target);
        let Foward_LookDir = MatrixCalculator.MultiplyVector(Camera_Y_Rotation_Matrix, Target);

        Target = VectorCalculator.Add_3D(Camera_Position, LookDir);

        //This is Merely a Reminder to Put Somewhere else, Since it Should Be Part of The Camera Movement
        let Forward = VectorCalculator.Mul_Value_3D(Foward_LookDir, WalkStep);
        let Sideways = MatrixCalculator.MultiplyVector(MatrixCalculator.MakeRotationY((Math.PI) / 2), Forward);

        let Camera_Matrix = MatrixCalculator.PointAt(Camera_Position, Target, Up);

        let ViewMatrix = MatrixCalculator.QuickInverse4x4(Camera_Matrix);

        return ViewMatrix;
    }
}

class NumericCalculator{
}

class Calculator {
    static Vector = VectorCalculator;
    static Matrix = MatrixCalculator;
    static Triangle = TriangleCalculator;
    static Numeric = NumericCalculator;
}

class PseudoPixel{
    X = 0;
    Y = 0;

    Red = 0;
    Green = 0;
    Blue = 0;
    Alpha = 0;

    constructor(x,y,r,g,b,a){
        this.X = x;
        this.Y = y;

        this.Red = r;
        this.Green = g;
        this.Blue = b;
        this.Alpha = a;
    }
}

class ImageHandler{
    static getPixel(ImageData,X,Y){
        let w = ImageData.width;

        let Pixel = Y*4*w + X*4;

        let R = ImageData.data[Pixel];
        let G = ImageData.data[Pixel+1];
        let B = ImageData.data[Pixel+2];
        let A = ImageData.data[Pixel+3];

        return [R,G,B,A];
    }
}

class ManageableImage{
    ImageData;

    constructor(Width,Height){
        this.ImageData = new ImageData(Width,Height);
    }

    getPixel(X,Y){
        let w = this.ImageData.width;

        let Pixel = Y*4*w + X*4;

        let R = this.ImageData.data[Pixel];
        let G = this.ImageData.data[Pixel+1];
        let B = this.ImageData.data[Pixel+2];
        let A = this.ImageData.data[Pixel+3];

        return [R,G,B,A];
    }

    setPixel(X,Y,R,G,B,A){
        let w = this.ImageData.width;

        let Pixel = Y*4*w + X*4;

        this.ImageData.data[Pixel] = R;
        this.ImageData.data[Pixel+1] = G;
        this.ImageData.data[Pixel+2] = B;
        this.ImageData.data[Pixel+3] = A;
    }
}

class DeprecatedTextureHandler{
    Screen_Width = 0;
    Screen_Heigth = 0;
    PixelsToDraw = new Array();
    DepthBuffer;

    constructor(Width,Heigth){
        this.Screen_Width = Width;
        this.Screen_Heigth = Heigth;
        this.PixelsToDraw = new Array();

        //Gambiarra
        let M = new Matrix(Width,Heigth);
        this.DepthBuffer = M.m;
    }
    /*
    There is a problem with this method:
    it will add Every Single Pixel to Draw, even if it is behind another pixel.
    Since Calculating the next pixel, wont remove the previous one.

    A solution for that would be adding the pixel directly to the image, since it would replace by the position
    Also making a image system, it would reduce the processing time, by removing the "Put the Pixel on the image" Step
    */
    AbsorbTriangle(V1,T1,V2,T2,V3,T3,ImageData){
        //Fist Sort Out The Hightest and the Lowest Point

        //Since The Highest Point on the Screen, has the lowest Y, will sort by this logic.

        if(V2.y < V1.y){
            let Vtemp,Ttemp;
            //Swap V2 with V1
            Vtemp = V2;
            V2 = V1;
            V1 = Vtemp;
            //Swap T2 with T1
            Ttemp = T2;
            T2 = T1;
            T1 = Ttemp;
        }

        if(V3.y < V1.y){
            let Vtemp,Ttemp;
            //Swap V3 with V1
            Vtemp = V3;
            V3 = V1;
            V1 = Vtemp;
            //Swap T3 with T1
            Ttemp = T3;
            T3 = T1;
            T1 = Ttemp;
        }

        if(V3.y < V2.y){
            let Vtemp,Ttemp;
            //Swap V3 with V2
            Vtemp = V3;
            V3 = V2;
            V2 = Vtemp;
            //Swap T3 with T2
            Ttemp = T3;
            T3 = T2;
            T2 = Ttemp;
        }
        
        //Now We Get a Line From The Hightest Point, to the middle and bottom Point:

        let Line1 = VectorCalculator.Sub_3D(V2,V1);
        let T_Line1 = VectorCalculator.Sub_2D(T2,T1);
        T_Line1.w = T2.w - T1.w;
        //Since The Depth of a 2D Point is not subtracted, we have to do it manually:
        
        let Line2 = VectorCalculator.Sub_3D(V3,V1);
        let T_Line2 = VectorCalculator.Sub_2D(T3,T1);
        T_Line2.w = T3.w - T1.w;

        //Initializing the Step Values:

        //a and b representing the x moved on a very specific y position
        let step_aX = 0;
        let step_bX = 0;

        let step_tx1 = 0;
        let step_ty1 = 0;
        let step_tw1 = 0;

        let step_tx2 = 0;
        let step_ty2 = 0;
        let step_tw2 = 0;

        let NotHorizontal1 = Line1.y != 0;
        let NotHorizontal2 = Line2.y != 0;

        //If the Line is not Completly Horizontal:
        if(NotHorizontal1){
            let Absolute = Math.abs(Line1.y);

            step_aX = Line1.x / Absolute;
            step_tx1 = T_Line1.x / Absolute;
            step_ty1 = T_Line1.y / Absolute;
            step_tw1 = T_Line1.w / Absolute;
        }
        if(NotHorizontal2){
            let Absolute = Math.abs(Line2.y);

            step_bX = Line2.x / Absolute;
            step_tx2 = T_Line2.x / Absolute;
            step_ty2 = T_Line2.y / Absolute;
            step_tw2 = T_Line2.w / Absolute;
        }

        //If the Line is not Completly Horizontal:
        if(NotHorizontal1){
            //For Every Value between V1.y and V2.y:
            for(let i = V1.y ; i<V2.y ; i++){
                //A Value That Goes Between 0 and The Maximum Length of the Line
                //Purpose: To Be Multiplied with the steps, and determin where how much to move.
                let Current_Step = (i - V1.y);

                //In This Current Y, Where will be the Point A and B?:
                let ax = V1.x + Current_Step * step_aX;
                let bx = V2.x + Current_Step * step_bX;

                let Texture_Start_X = T1.x + Current_Step * step_tx1;
                let Texture_Start_Y = T1.y + Current_Step * step_ty1;
                let Texture_Start_W = T1.w + Current_Step * step_tw1;

                let Texture_End_X = T1.x + Current_Step * step_tx2;
                let Texture_End_Y = T1.y + Current_Step * step_ty2;
                let Texture_End_W = T1.w + Current_Step * step_tw2;

                //a Must Be at The left, so, if it has a highter X, we need to swap, so it has the lower X
                if(ax > bx){
                    let Temp;

                    Temp = ax;
                    ax = bx;
                    bx = Temp;

                    Temp = Texture_Start_X;
                    Texture_Start_X = Texture_End_X;
                    Texture_End_X = Temp;

                    Temp = Texture_Start_Y;
                    Texture_Start_Y = Texture_End_Y;
                    Texture_End_Y = Temp;

                    Temp = Texture_Start_W;
                    Texture_Start_W = Texture_End_W;
                    Texture_End_W = Temp;
                }

                let Current_Texture_X = Texture_Start_X;
                let Current_Texture_Y = Texture_Start_Y;
                let Current_Texture_W = Texture_Start_W;

                let Texture_Step = 1 / (bx - ax);
                let Current_Texture_Step = 0;

                for(let l = ax; l < bx ; l++){
                    let PixelTextureStep = 1 - Current_Texture_Step;

                    Current_Texture_X = PixelTextureStep * Texture_Start_X + Current_Texture_Step * Texture_End_X;
                    Current_Texture_Y = PixelTextureStep * Texture_Start_Y + Current_Texture_Step * Texture_End_Y;
                    Current_Texture_W = PixelTextureStep * Texture_Start_W + Current_Texture_Step * Texture_End_W;

                    
                    if(this.getDepthBufferPixel(l,i) < Current_Texture_W){

                        let Pixel = ImageHandler.getPixel(ImageData,Current_Texture_X / Current_Texture_W,Current_Texture_Y / Current_Texture_W);

                        this.AddPixelToDraw(l,i,Pixel[0],Pixel[1],Pixel[2],Pixel[3]);

                        this.setDepthBufferPixel(l,i,Current_Texture_W);
                    }

                    Current_Texture_Step += Texture_Step;
                }
            }
        }

        //Due To Lazyness Im Gonna Reuse Some Of The Previous Code

        Line1 = VectorCalculator.Sub_3D(V3,V2);
        T_Line1 = VectorCalculator.Sub_2D(T3,T2);
        T_Line1.w = T3.w - T2.w;

        NotHorizontal1 = Line1.y != 0;

        if(NotHorizontal1){
            let Absolute = Math.abs(Line1.y);

            step_aX = Line1.x / Absolute;
            step_tx1 = T_Line1.x / Absolute;
            step_ty1 = T_Line1.y / Absolute;
            step_tw1 = T_Line1.w / Absolute;
        }
        else{
            step_tx1 = 0;
            step_ty1 = 0;
        }

        if(NotHorizontal1){
            //For Every Value between V1.y and V2.y:
            for(let i = V2.y ; i<V3.y ; i++){
                //A Value That Goes Between 0 and The Maximum Length of the Line
                //Purpose: To Be Multiplied with the steps, and determin where how much to move.
                let Current_Step = (i - V1.y);
                let Current_Step2 = (i - V2.y);

                //In This Current Y, Where will be the Point A and B?:
                let ax = V2.x + Current_Step2 * step_aX;
                let bx = V1.x + Current_Step * step_bX;

                let Texture_Start_X = T2.x + Current_Step2 * step_tx1;
                let Texture_Start_Y = T2.y + Current_Step2 * step_ty1;
                let Texture_Start_W = T2.w + Current_Step2 * step_tw1;

                let Texture_End_X = T1.x + Current_Step * step_tx2;
                let Texture_End_Y = T1.y + Current_Step * step_ty2;
                let Texture_End_W = T1.w + Current_Step * step_tw2;

                //a Must Be at The left, so, if it has a highter X, we need to swap, so it has the lower X
                if(ax > bx){
                    let Temp;

                    Temp = ax;
                    ax = bx;
                    bx = Temp;

                    Temp = Texture_Start_X;
                    Texture_Start_X = Texture_End_X;
                    Texture_End_X = Temp;

                    Temp = Texture_Start_Y;
                    Texture_Start_Y = Texture_End_Y;
                    Texture_End_Y = Temp;

                    Temp = Texture_Start_W;
                    Texture_Start_W = Texture_End_W;
                    Texture_End_W = Temp;
                }

                let Current_Texture_X = Texture_Start_X;
                let Current_Texture_Y = Texture_Start_Y;
                let Current_Texture_W = Texture_Start_W;

                let Texture_Step = 1 / (bx - ax);
                let Current_Texture_Step = 0;

                for(let l = ax; l < bx ; l++){
                    let PixelTextureStep = 1 - Current_Texture_Step;

                    Current_Texture_X = PixelTextureStep * Texture_Start_X + Current_Texture_Step * Texture_End_X;
                    Current_Texture_Y = PixelTextureStep * Texture_Start_Y + Current_Texture_Step * Texture_End_Y;
                    Current_Texture_W = PixelTextureStep * Texture_Start_W + Current_Texture_Step * Texture_End_W;

                    
                    if(this.getDepthBufferPixel(l,i) < Current_Texture_W){

                        let Pixel = ImageHandler.getPixel(ImageData,Current_Texture_X / Current_Texture_W,Current_Texture_Y / Current_Texture_W);

                        this.AddPixelToDraw(l,i,Pixel[0],Pixel[1],Pixel[2],Pixel[3]);

                        this.setDepthBufferPixel(l,i,Current_Texture_W);
                    }

                    Current_Texture_Step += Texture_Step;
                }
            }
        }
    }

    AddPixelToDraw(X,Y,R,G,B,A){
        this.PixelsToDraw.push(new PseudoPixel(X,Y,R,G,B,A));
    }

    getDepthBufferPixel(x,y){
        return this.DepthBuffer[x][y];
    }

    setDepthBufferPixel(x,y,Value){
        this.DepthBuffer[x][y] = Value;
    }

    Reset(){
        this.PixelsToDraw = new Array();

        //Gambiarra
        let M = new Matrix(this.Screen_Width,this.Screen_Heigth);
        this.DepthBuffer = M.m;
    }

    GenerateImageData(){
        let OutputImage = new ManageableImage(this.Screen_Width,this.Screen_Heigth);

        for(let i = 0;i<this.PixelsToDraw.length;i++){
            //P = Pixel
            let P = this.PixelsToDraw[i];

            OutputImage.setPixel(P.X,P.Y,P.Red,P.Green,P.Blue,P.Alpha);
        }

        return OutputImage;
    }
}

class TextureHandler{
    Screen_Width = 0;
    Screen_Heigth = 0;
    Current_Output;
    DepthBuffer;

    constructor(Width,Heigth){
        this.Screen_Width = Width;
        this.Screen_Heigth = Heigth;

        this.Current_Output = new ManageableImage(Width,Heigth);

        //Gambiarra
        let M = new Matrix(Width,Heigth);
        this.DepthBuffer = M.m;
    }

    Reset(){
        this.Current_Output = new ManageableImage(this.Screen_Width,this.Screen_Heigth);

        //Gambiarra
        let M = new Matrix(this.Screen_Width,this.Screen_Heigth);
        this.DepthBuffer = M.m;
    }

    getDepthBufferPixel(x,y){
        return this.DepthBuffer[x][y];
    }

    setDepthBufferPixel(x,y,Value){
        this.DepthBuffer[x][y] = Value;
    }

    AbsorbTriangle(V1,T1,V2,T2,V3,T3,ImageData){
        //Fist Sort Out The Hightest and the Lowest Point

        //Since The Highest Point on the Screen, has the lowest Y, will sort by this logic.

        if(V2.y < V1.y){
            let Vtemp,Ttemp;
            //Swap V2 with V1
            Vtemp = V2;
            V2 = V1;
            V1 = Vtemp;
            //Swap T2 with T1
            Ttemp = T2;
            T2 = T1;
            T1 = Ttemp;
        }

        if(V3.y < V1.y){
            let Vtemp,Ttemp;
            //Swap V3 with V1
            Vtemp = V3;
            V3 = V1;
            V1 = Vtemp;
            //Swap T3 with T1
            Ttemp = T3;
            T3 = T1;
            T1 = Ttemp;
        }

        if(V3.y < V2.y){
            let Vtemp,Ttemp;
            //Swap V3 with V2
            Vtemp = V3;
            V3 = V2;
            V2 = Vtemp;
            //Swap T3 with T2
            Ttemp = T3;
            T3 = T2;
            T2 = Ttemp;
        }

        //Now We Get a Line From The Hightest Point, to the middle and bottom Point:

        let Line1 = VectorCalculator.Sub_3D(V2,V1);
        let T_Line1 = VectorCalculator.Sub_2D(T2,T1);
        T_Line1.w = T2.w - T1.w;
        //Since The Depth of a 2D Point is not subtracted, we have to do it manually:
        
        let Line2 = VectorCalculator.Sub_3D(V3,V1);
        let T_Line2 = VectorCalculator.Sub_2D(T3,T1);
        T_Line2.w = T3.w - T1.w;

        //Initializing the Step Values:

        //a and b representing the x moved on a very specific y position
        let step_aX = 0;
        let step_bX = 0;

        let step_tx1 = 0;
        let step_ty1 = 0;
        let step_tw1 = 0;

        let step_tx2 = 0;
        let step_ty2 = 0;
        let step_tw2 = 0;

        let NotHorizontal1 = Line1.y != 0;
        let NotHorizontal2 = Line2.y != 0;

        //If the Line is not Completly Horizontal:
        if(NotHorizontal1){
            let Absolute = Math.abs(Line1.y);

            step_aX  =   Line1.x / Absolute;
            step_tx1 = T_Line1.x / Absolute;
            step_ty1 = T_Line1.y / Absolute;
            step_tw1 = T_Line1.w / Absolute;
        }

        if(NotHorizontal2){
            let Absolute = Math.abs(Line2.y);

            step_bX = Line2.x / Absolute;
            step_tx2 = T_Line2.x / Absolute;
            step_ty2 = T_Line2.y / Absolute;
            step_tw2 = T_Line2.w / Absolute;
        }

        //If the Line is not Completly Horizontal:
        if(NotHorizontal1){
            //For Every Value between V1.y and V2.y:
            for(let i = V1.y ; i <= V2.y ; i++){
                //A Value That Goes Between 0 and The Maximum Length of the Line
                //Purpose: To Be Multiplied with the steps, and determin where how much to move.
                let Current_Step = (i - V1.y);

                //In This Current Y, Where will be the Point A and B?:
                let ax = V1.x + Current_Step * step_aX;
                let bx = V1.x + Current_Step * step_bX;

                let Texture_Start_X = T1.x + Current_Step * step_tx1;
                let Texture_Start_Y = T1.y + Current_Step * step_ty1;
                let Texture_Start_W = T1.w + Current_Step * step_tw1;

                let Texture_End_X = T1.x + Current_Step * step_tx2;
                let Texture_End_Y = T1.y + Current_Step * step_ty2;
                let Texture_End_W = T1.w + Current_Step * step_tw2;

                //a Must Be at The left, so, if it has a highter X, we need to swap, so it has the lower X
                if(ax > bx){
                    let Temp;

                    Temp = ax;
                    ax = bx;
                    bx = Temp;

                    Temp = Texture_Start_X;
                    Texture_Start_X = Texture_End_X;
                    Texture_End_X = Temp;

                    Temp = Texture_Start_Y;
                    Texture_Start_Y = Texture_End_Y;
                    Texture_End_Y = Temp;

                    Temp = Texture_Start_W;
                    Texture_Start_W = Texture_End_W;
                    Texture_End_W = Temp;
                }

                ax = Math.floor(ax);
                bx = Math.floor(bx);

                let Current_Texture_X = Texture_Start_X;
                let Current_Texture_Y = Texture_Start_Y;
                let Current_Texture_W = Texture_Start_W;

                let Texture_Step = 1 / (bx - ax);
                let Current_Texture_Step = 0;

                for(let l = ax; l < bx ; l++){
                    let PixelTextureStep = 1 - Current_Texture_Step;

                    Current_Texture_X = PixelTextureStep * Texture_Start_X + Current_Texture_Step * Texture_End_X;
                    Current_Texture_Y = PixelTextureStep * Texture_Start_Y + Current_Texture_Step * Texture_End_Y;
                    Current_Texture_W = PixelTextureStep * Texture_Start_W + Current_Texture_Step * Texture_End_W;

                    if(l < 0){
                        l = 0;
                    }
                    if(this.getDepthBufferPixel(l,i) < Current_Texture_W){

                        let Pixel = ImageHandler.getPixel(ImageData,Math.round(Current_Texture_X / Current_Texture_W),Math.round(Current_Texture_Y / Current_Texture_W));

                        this.Current_Output.setPixel(l,i,Pixel[0],Pixel[1],Pixel[2],Pixel[3]);

                        this.setDepthBufferPixel(l,i,Current_Texture_W);
                    }

                    Current_Texture_Step += Texture_Step;
                }
            }
        }
        //Due To Lazyness Im Gonna Reuse Some Of The Previous Code

        Line1 = VectorCalculator.Sub_3D(V3,V2);
        T_Line1 = VectorCalculator.Sub_2D(T3,T2);
        T_Line1.w = T3.w - T2.w;

        NotHorizontal1 = Line1.y != 0;

        if(NotHorizontal1){
            let Absolute = Math.abs(Line1.y);

            step_aX = Line1.x / Absolute;
            step_tx1 = T_Line1.x / Absolute;
            step_ty1 = T_Line1.y / Absolute;
            step_tw1 = T_Line1.w / Absolute;
        }
        else{
            step_tx1 = 0;
            step_ty1 = 0;
        }

        if(NotHorizontal1){
            //For Every Value between V1.y and V2.y:
            for(let i = V2.y ; i<=V3.y ; i++){
                //A Value That Goes Between 0 and The Maximum Length of the Line
                //Purpose: To Be Multiplied with the steps, and determin where how much to move.
                let Current_Step = (i - V1.y);
                let Current_Step2 = (i - V2.y);

                //In This Current Y, Where will be the Point A and B?:
                let ax = V2.x + Current_Step2 * step_aX;
                let bx = V1.x + Current_Step * step_bX;

                let Texture_Start_X = T2.x + Current_Step2 * step_tx1;
                let Texture_Start_Y = T2.y + Current_Step2 * step_ty1;
                let Texture_Start_W = T2.w + Current_Step2 * step_tw1;

                let Texture_End_X = T1.x + Current_Step * step_tx2;
                let Texture_End_Y = T1.y + Current_Step * step_ty2;
                let Texture_End_W = T1.w + Current_Step * step_tw2;

                //a Must Be at The left, so, if it has a highter X, we need to swap, so it has the lower X
                if(ax > bx){
                    let Temp;

                    Temp = ax;
                    ax = bx;
                    bx = Temp;

                    Temp = Texture_Start_X;
                    Texture_Start_X = Texture_End_X;
                    Texture_End_X = Temp;

                    Temp = Texture_Start_Y;
                    Texture_Start_Y = Texture_End_Y;
                    Texture_End_Y = Temp;

                    Temp = Texture_Start_W;
                    Texture_Start_W = Texture_End_W;
                    Texture_End_W = Temp;
                }

                ax = Math.floor(ax);
                bx = Math.floor(bx);

                let Current_Texture_X = Texture_Start_X;
                let Current_Texture_Y = Texture_Start_Y;
                let Current_Texture_W = Texture_Start_W;

                let Texture_Step = 1 / (bx - ax);
                let Current_Texture_Step = 0;

                
                for(let l = ax; l < bx ; l++){
                    let PixelTextureStep = 1 - Current_Texture_Step;

                    Current_Texture_X = PixelTextureStep * Texture_Start_X + Current_Texture_Step * Texture_End_X;
                    Current_Texture_Y = PixelTextureStep * Texture_Start_Y + Current_Texture_Step * Texture_End_Y;
                    Current_Texture_W = PixelTextureStep * Texture_Start_W + Current_Texture_Step * Texture_End_W;

                    if(l < 0){
                        l = 0;
                    }
                    if(this.getDepthBufferPixel(l,i) < Current_Texture_W){
                        let Pixel = ImageHandler.getPixel(ImageData,Math.round(Current_Texture_X / Current_Texture_W),Math.round(Current_Texture_Y / Current_Texture_W));

                        this.Current_Output.setPixel(l,i,Pixel[0],Pixel[1],Pixel[2],Pixel[3]);

                        this.setDepthBufferPixel(l,i,Current_Texture_W);
                    }

                    Current_Texture_Step += Texture_Step;
                }
            }
        }
    }

    LazyAbsorbTriangle(Triangle,ImageData){
        this.AbsorbTriangle(Triangle.V1,Triangle.T1,Triangle.V2,Triangle.T2,Triangle.V3,Triangle.T3,ImageData);
    }
}

class Screen{
    Canvas;
    Context;

    Width = 0;
    Height = 0;

    constructor(Canvas_ID){
        this.Canvas = document.getElementById(Canvas_ID);
        this.Context = this.Canvas.getContext("2d");

        this.Width = this.Canvas.width;
        this.Height = this.Canvas.height;
    }

    Config_CanvasPixels(Width,Height){
        this.Canvas.width = Width;
        this.Canvas.height = Height;

        this.Width = Width;
        this.Height = Height;
    }

    Manipulate_Scale(Width_Scale,Height_Scale){
        this.Context.scale(Width_Scale,Height_Scale);
    }

    Set_LineStyle(StrokeStyle,LineWidth,LineCap,MiterLimit){
        if(StrokeStyle){
            this.Context.strokeStyle = StrokeStyle;
        }
        if(LineWidth){
            this.Context.lineWidth = LineWidth;
        }
        if(LineCap){
            this.Context.lineCap = LineCap;
        }
        if(MiterLimit){
            this.Context.miterLimit = MiterLimit;
        }
    }

    Set_PolygonStyle(StrokeStyle,LineWidth,LineCap,MiterLimit,FillStyle){
        this.Set_LineStyle(StrokeStyle,LineWidth,LineCap,MiterLimit);
        if(FillStyle){
            this.Context.fillStyle = FillStyle;
        }
    }

    Reset_LineStyle(){
        this.Context.strokeStyle = '#000000';
        this.Context.lineWidth = 1;
        this.Context.lineCap = 'Butt';
        this.Context.miterLimit = 10;
    }

    Reset_PolygonStyle(){
        this.Reset_LineStyle();
        this.Context.fillStyle = '#000000';
    }

    Clear_Screen(){
        this.Context.clearRect(0,0,this.Width,this.Height);
    }

    Draw_Line(Origin_X,Origin_Y,Destination_X,Destination_Y){
        this.Context.beginPath();

        this.Context.moveTo(Origin_X,Origin_Y);
        this.Context.lineTo(Destination_X,Destination_Y);

        this.Context.closePath();
        this.Context.stroke();
    }

    Draw_Text(Text, x, y){
        this.Context.strokeText(Text, x, y);
    }

    Draw_Triangle(X1,Y1,X2,Y2,X3,Y3,Fill_Bool){
        this.Context.beginPath();

        this.Context.moveTo(X1,Y1);
        this.Context.lineTo(X2,Y2);
        this.Context.lineTo(X3,Y3);
        this.Context.lineTo(X1,Y1);

        if(Fill_Bool){
            this.Context.fill();
        }

        this.Context.closePath();
        this.Context.stroke();
    }

    Paint_Pixel(X,Y,Red,Green,Blue,Alpha){
        let ImgData = this.Context.createImageData(1,1);

        ImgData.data[0] = Red;
        ImgData.data[1] = Green;
        ImgData.data[2] = Blue;
        ImgData.data[3] = Alpha;

        this.Context.putImageData(ImgData,X,Y);
    }

    Paint_PixelRow(X,Y,Length,Red,Green,Blue,Alpha){
        let ImgData = this.Context.createImageData(Length,1);

        for(let i = 0;i<Length*4;i+=4){
            ImgData.data[0+i] = Red;
            ImgData.data[1+i] = Green;
            ImgData.data[2+i] = Blue;
            ImgData.data[3+i] = Alpha;
        }

        this.Context.putImageData(ImgData,X,Y);
    }

    PutImageData(ImageData){
        this.Context.putImageData(ImageData,0,0);
    }
}

//The Main Big Boi:
class EngineRunner{
    Camera = new Camera(0,0,0);

    Screen_Width = 0;
    Screen_Heigth = 0;

    Mesh_List = new Array();

    Texture_Handler;

    Projection;

    constructor(Screen_Width , Screen_Heigth , Fov_Degrees , Near_Distance, Far_Distance){
        this.Screen_Width = Screen_Width;
        this.Screen_Heigth = Screen_Heigth;

        let Aspect_Ratio = Screen_Heigth / Screen_Width;

        this.Camera = new Camera(0,0,0);

        this.Projection = MatrixCalculator.MakeProjection(Fov_Degrees,Aspect_Ratio,Near_Distance,Far_Distance);

        this.Texture_Handler = new TextureHandler(Screen_Width,Screen_Heigth);
    }

    Initialize_Meshs(){
        for(let i = 0;i<this.Mesh_List.length;i++){
            this.Mesh_List[i].Initialize();
        }
    }

    Run_Cycle(){
        let View_Matrix = this.Camera.Calculate_BasicViewSpace();

        this.Texture_Handler.Reset();
        //For Each Mesh Do:
        for(let Mesh_Index = 0;Mesh_Index < this.Mesh_List.length;Mesh_Index++){
            let Current_Mesh = this.Mesh_List[Mesh_Index];
            
            //For Each Triangle Inside The Mesh Do:
            for(let Triangle_Index = 0;Triangle_Index < Current_Mesh.Reference_Triangles.Units.length;Triangle_Index++){
                let Current_Triangle = Current_Mesh.Reference_Triangles.Units[Triangle_Index];

                //If The Triangle is NOT Facing The Camera, Jump to the next one.
                if(!TriangleCalculator.IsFacingCamera(Current_Triangle,this.Camera.Position)){
                    continue;
                }

                //Aplly the View Matrix to Simulate Camera Seeing Stuff
                let ViewedTriangle = TriangleCalculator.ApplyViewMatrix(View_Matrix,Current_Triangle);

                //Clips The Triangle With the Imediate Front of the Camera
                let ClippedTriangles = TriangleCalculator.ClipAgainstPlane(new Vector3D(0,0,0.1,0),new Vector3D(0,0,1,0),ViewedTriangle);

                //If 0 Triangles Were Resulted On The Front Clipping, Skip to the next Triangle
                if(ClippedTriangles.length == 0){
                    continue;
                }

                //Project The Resulting Triangles
                let Projected_Triangles = new Array();
                for(let Project_Index = 0;Project_Index < ClippedTriangles.length;Project_Index++){
                    let Current_To_Project = ClippedTriangles[Project_Index];
                    let Projected = TriangleCalculator.Project(this.Screen_Width,this.Screen_Heigth,Current_To_Project,this.Projection);

                    Projected_Triangles.push(Projected);
                }

                //Clips The Triangles With The Screen Borders
                let ScreenClipped_Triangles = TriangleCalculator.ClipMultipleAgainstScreen(this.Screen_Width,this.Screen_Heigth,Projected_Triangles);

                //Then We Put All Of The Textured Triangle On The Image
                for(let Textured = 0;Textured < ScreenClipped_Triangles.length;Textured++){
                    let Current_Triangle = ScreenClipped_Triangles[Textured];

                    //Lazy Fix,But still... a fix
                    Current_Triangle.V1.x = Math.floor(Current_Triangle.V1.x);
                    Current_Triangle.V1.y = Math.floor(Current_Triangle.V1.y);

                    Current_Triangle.V2.x = Math.floor(Current_Triangle.V2.x);
                    Current_Triangle.V2.y = Math.floor(Current_Triangle.V2.y);

                    Current_Triangle.V3.x = Math.floor(Current_Triangle.V3.x);
                    Current_Triangle.V3.y = Math.floor(Current_Triangle.V3.y);

                    this.Texture_Handler.LazyAbsorbTriangle(Current_Triangle,Current_Mesh.ImageData);
                }
            }
        }
    }
}