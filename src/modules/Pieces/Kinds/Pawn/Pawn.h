#pragma once

#include <cmath>
#include <memory>

#include "../../Piece.h"
#include "../../Utils/RawPosition/RawPosition.h"

using std::abs;
using std::unique_ptr;
using std::make_unique;

class Pawn: public Piece<RawPosition> {
    private:
        bool enPassant;
        bool hasGoneEnPassant;

    public:
        Pawn(PieceParams*);

        bool getEnPassant();
        void updateEnPassantState(int, int);

        virtual void onMoveEnd(int, int) override;
        virtual vector<RawPosition> getPossibleMoves() override;
};
