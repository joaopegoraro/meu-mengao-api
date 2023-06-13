import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Partida {
    @PrimaryColumn()
    id: string;

    @Column()
    data: string;

    @Column()
    timeCasa: string;

    @Column()
    timeFora: string;

    @Column({ type: 'text' })
    escudoCasa: string;

    @Column({ type: 'text' })
    escudoFora: string;

    @Column()
    golsCasa: string;

    @Column()
    golsFora: string;

    @Column()
    campeonato: string;

    @Column()
    campeonatoId: string;

    @Column()
    partidaFlamengo: boolean;

    @Column({ nullable: true })
    rodadaName: string;

    @Column({ nullable: true })
    rodadaIndex: number;
}
