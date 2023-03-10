import { Ability, AbilityBuilder, AbilityClass, createMongoAbility, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { User } from "src/users/entities/users.entity";


export enum Action {
    Manage = 'manage', // wild card for any action
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}

export type Subjects = InferSubjects<typeof User> | 'all';


@Injectable()
export class AbilityFactory {

    defineAbility(user: User){
        // define rules
        const builder = new AbilityBuilder(createMongoAbility);
        const {can, cannot} = createMongoAbility<[Action, Subjects]>(); 
        // const {can, cannot, build} = new AbilityBuilder(Ability as AbilityClass<AppAbility>,); 
         
        if(user.isAdmin){
            builder.can(Action.Manage, 'all');
        }
        else{
            builder.cannot(Action.Read, 'all');
            builder.cannot(Action.Create, User).because('only admin (special message)')
        }


        return builder.build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }

}
