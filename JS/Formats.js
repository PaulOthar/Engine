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

    static Div_3D(Vector_1, Vector_2) {
        let Vec = new Vector3D(0, 0, 0, 0);

        Vec.x = Vector_1.x / Vector_2.x;
        Vec.y = Vector_1.y / Vector_2.y;
        Vec.z = Vector_1.z / Vector_2.z;

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

        Clipped_Triangles = ClipAgainstScreenPlane(TL_Corner, L_Normal,Clipped_Triangles);

        Clipped_Triangles = ClipAgainstScreenPlane(BL_Corner, B_Normal,Clipped_Triangles);

        Clipped_Triangles = ClipAgainstScreenPlane(TR_Corner, R_Normal,Clipped_Triangles);

        return Clipped_Triangles;
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

class MatrixCalculator {

}

class Calculator {
    static Vector = VectorCalculator;
    static Matrix = MatrixCalculator;
    static Triangle = TriangleCalculator;
}

let ms = new Mesh();

ms.AddSpaceVector(1, 1, 0, 0);
ms.AddSpaceVector(1, 6, 0, 1);
ms.AddSpaceVector(6, 6, 0, 2);

ms.AddTextureVector(2, 2, 0);
ms.AddTextureVector(2, 1, 1);
ms.AddTextureVector(1, 1, 2);

ms.AddConnectionTriangle(0, 1, 2, 0, 1, 2, 0);

ms.BuildReferenceTriangles();

Calculator.Triangle.ClipAgainstPlane(new Vector3D(4, 2, 0, 0), new Vector3D(0, 1, 0, 0), ms.Reference_Triangles.Units[0]);