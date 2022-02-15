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
    Reference_Triangles;

    Texture;

    constructor(id) {
        super(id);
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

        return VectorCalculator.Add_2D(lineStart, lineToIntersect);
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

        console.log(Output);

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

        console.log(Inside_Output);
        console.log(Outside_Output);

        return Output;
    }

    static Project(Screen_Width, Screen_Heigth, Triangle, ProjectionMatrix) {
        Triangle.V1 = MatrixCalculator.MultiplyVector(ProjectionMatrix, Triangle.V1);
        Triangle.V2 = MatrixCalculator.MultiplyVector(ProjectionMatrix, Triangle.V2);
        Triangle.V3 = MatrixCalculator.MultiplyVector(ProjectionMatrix, Triangle.V3);

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

class Calculator {
    static Vector = VectorCalculator;
    static Matrix = MatrixCalculator;
    static Triangle = TriangleCalculator;
}

let ref = new ReferenceTriangle(new Vector3D(10, 0, 0, 1), new Vector3D(0, 10, 0, 3), new Vector3D(-10, 0, 0, 2), new Vector2D(1, 0, 1), new Vector2D(0, 1, 3), new Vector2D(-1, 0, 2));

ref.InvertFace();

console.log("Is Clockwise?:", Calculator.Triangle.IsClockwise(ref));

let trig = Calculator.Triangle.SplitTriangle(new Vector3D(0, 1, 0, 0), new Vector3D(1, 1, 0, 0), ref);

let Triangulos = new Array();

for (let i = 0; i < trig[0].length; i++) {
    Triangulos.push(trig[0][i]);
}
for (let i = 0; i < trig[1].length; i++) {
    Triangulos.push(trig[1][i]);
}

let Cam = new Vector3D(0, 0, -5, 0);

console.log("Ref", Calculator.Triangle.IsFacingCamera(ref, Cam));

for (let i = 0; i < Triangulos.length; i++) {
    console.log(Triangulos[i].ID, Calculator.Triangle.IsFacingCamera(Triangulos[i], Cam));
}