#pragma once

#include <vector>
#include <cmath>

#include "../../Piece.h"
#include "../HasMoved/HasMoved.h"

using std::vector;

class CastlePiece: public HasMoved {
    public:
        CastlePiece(PieceParams*);

        bool isTreatened();
        int getCorrespondingRow();
        bool checkIfEmptyAndSafe(int, int);
        vector<RawPosition> getEnemyMoves(bool);
};
