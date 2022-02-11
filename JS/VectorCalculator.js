class VectorCalculator{
    static Add(X1,Y1,Z1,X2,Y2,Z2){
        let X = X1 + X2;
        let Y = Y1 + Y2;
        let Z = Z1 + Z2;

        return [X,Y,Z];
    }

    static Sub(X1,Y1,Z1,X2,Y2,Z2){
        let X = X1 - X2;
        let Y = Y1 - Y2;
        let Z = Z1 - Z2;

        return [X,Y,Z]
    }

    static Mul(X1,Y1,Z1,X2,Y2,Z2){
        let X = X1 * X2;
        let Y = Y1 * Y2;
        let Z = Z1 * Z2;

        return [X,Y,Z];
    }

    static Div(X1,Y1,Z1,X2,Y2,Z2){
        let X = X1 / X2;
        let Y = Y1 / Y2;
        let Z = Z1 / Z2;

        return [X,Y,Z];
    }

    static Add_V(X,Y,Z,V){
        return VectorCalculator.Add(X,Y,Z,V,V,V);
    }

    static Sub_V(X,Y,Z,V){
        return VectorCalculator.Sub(X,Y,Z,V,V,V);
    }

    static Mul_V(X,Y,Z,V){
        return VectorCalculator.Mul(X,Y,Z,V,V,V);
    }

    static Div_V(X,Y,Z,V){
        return VectorCalculator.Div(X,Y,Z,V,V,V);
    }

    static DotProduct(X1,Y1,Z1,X2,Y2,Z2){
        let X = X1 * X2;
        let Y = Y1 * Y2;
        let Z = Z1 * Z2;

        return X + Y + Z;
    }

    static Length(X,Y,Z){
        let x = X * X;
        let y = Y * Y;
        let z = Z * Z;

        let xyz = x + y + z;

        return Math.sqrt(xyz);
    }

    static Normalize(X,Y,Z){
        let Length = VectorCalculator.Length(X,Y,Z);

        let Norm_X = X/Length;
        let Norm_Y = Y/Length;
        let Norm_Z = Z/Length;

        return [Norm_X,Norm_Y,Norm_Z];
    }

    static CrossProduct(X1,Y1,Z1,X2,Y2,Z2){
        let X = Y1 * Z2 - Z1 * Y2;
        let Y = Z1 * X2 - X1 * Z2;
        let Z = X1 * Y2 - Y1 * X2;

        return [X,Y,Z];
    }

    static PlaneIntersection(Plane_X,Plane_Y,Plane_Z,Normal_X,Normal_Y,Normal_Z,Line_Start_X,Line_Start_Y,Line_Start_Z,Line_End_X,Line_End_Y,Line_End_Z){
        //In order To Work, the Normal Should Be Relative To (0,0,0).
        //It can be done by subtracting the Normal by the plane
        //Also the normal should be normalized

        let Plane_DotProduct = VectorCalculator.DotProduct(Plane_X,Plane_Y,Plane_Z , Normal_X,Normal_Y,Normal_Z);
        let Start_Normal_DotProduct = VectorCalculator.DotProduct(Line_Start_X,Line_Start_Y,Line_Start_Z , Normal_X,Normal_Y,Normal_Z);
        let End_Normal_DotProduct = VectorCalculator.DotProduct(Line_End_X,Line_End_Y,Line_End_Z , Normal_X,Normal_Y,Normal_Z);

        let T = (Plane_DotProduct - Start_Normal_DotProduct)/(End_Normal_DotProduct - Start_Normal_DotProduct);

        let FullLine = VectorCalculator.Sub(Line_End_X,Line_End_Y,Line_End_Z , Line_Start_X,Line_Start_Y,Line_Start_Z);
        let Line_To_Intersect = VectorCalculator.Mul_V(FullLine[0],FullLine[1],FullLine[2] , T);

        console.log(Line_To_Intersect);

        let Intersection = VectorCalculator.Add(Line_Start_X,Line_Start_Y,Line_Start_Z , Line_To_Intersect[0],Line_To_Intersect[1],Line_To_Intersect[2]);

        return Intersection;
    }

    static PlaneInsideness(Plane_Normal_X,Plane_Normal_Y,Plane_Normal_Z,Plane_DotProduct,Vector_X,Vector_Y,Vector_Z){
        //Returns a Value of How Much a Vector is Inside the Plane (That means, not against the normal)
        //A Negative Output Means that the Vector is Outside of the Plane

        let X = Plane_Normal_X * Vector_X;
        let Y = Plane_Normal_Y * Vector_Y;
        let Z = Plane_Normal_Z * Vector_Z;

        return X + Y + Z - Plane_DotProduct;
    }
}

let N = VectorCalculator.Normalize(1,1,0);

console.log(VectorCalculator.PlaneIntersection(0,0,0 , N[0],N[1],N[2] , -2,-1,0 , 2,2,0));