#pragma once

#include "PossibleMoveParams.h"

#include "../../../Pieces/Piece.h"
#include "../../../Common/Config/Config.h"
#include "../../../Pieces/Utils/Position/Position.h"
#include "../../../Board/BoardBuilder/BoardBuilder.h"
#include "../../../Pieces/Utils/RawPosition/RawPosition.h"

struct PossibleMoveParams {
    App* app;
    Config* config;
    RawPosition* rawPosition;
    BoardBuilder* boardBuilder;
    Piece<RawPosition>* selectedPiece;
};
