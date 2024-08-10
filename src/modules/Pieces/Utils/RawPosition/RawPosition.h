#pragma once 

class RawPosition {
    private:
        int row;
        int column;

    public:
        RawPosition();
        RawPosition(int);
        RawPosition(int, int);

        void setRow(int);
        void setColumn(int);

        int getRow();
        int getColumn();
};
