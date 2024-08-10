#pragma once

class Position {
    private:
        int x;
        int y;

    public:
        Position();
        Position(int);
        Position(int, int);

        int getX();
        int getY();

        void setX(int);
        void setY(int);
};
