"use server";

import {PieceMetaData, PublicUser} from "@/app/types";

type UserPiecesListProps = {
    user: PublicUser
}

export default async function UserPiecesList(props: UserPiecesListProps) {
    const {user} = props;

    return (
        <div>
            pieces list
        </div>
    )
}