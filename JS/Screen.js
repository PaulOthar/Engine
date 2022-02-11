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
}