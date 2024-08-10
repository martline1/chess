#pragma once

#include "../../Piece.h"
#include "../../Utils/RawPosition/RawPosition.h"

class HasMoved: public Piece<RawPosition> {
    private:
        bool hasMoved;

    public:
        HasMoved(PieceParams*);

        bool getHasMoved();
        virtual void onMoveEnd(int, int) override;
};
