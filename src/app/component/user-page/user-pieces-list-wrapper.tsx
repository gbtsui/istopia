import UserPiecesList from "@/app/component/dashboard/user-pieces-list";
import { PublicUser } from "@/app/types";

type Props = {
    user: PublicUser;
    is_user: boolean;
};

export default function UserPiecesListWrapper({ user, is_user }: Props) {
    return <UserPiecesList user={user} is_user={is_user} />;
}