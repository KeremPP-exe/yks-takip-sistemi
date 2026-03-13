export function calculateYksScores(tytNet: any, aytNet: any, obp: number) {
    // TYT score = 100 + (Türkçe * 3.3) + (Sosyal * 3.4) + (Mat * 3.3) + (Fen * 3.4)
    const tytRaw = 100 + (tytNet.turkish * 3.3) + (tytNet.social * 3.4) + (tytNet.math * 3.3) + (tytNet.science * 3.4);

    // TYT 40% Contribution (approximate)
    const tytContribution = (tytNet.turkish * 1.32) + (tytNet.social * 1.36) + (tytNet.math * 1.32) + (tytNet.science * 1.36);

    // SAY score = 100 base + TYT 40% + AYT SAY (Mat:3.0, Fiz:2.85, Kim:3.07, Biy:3.07)
    const aytSayRaw = 100 + tytContribution + (aytNet.math * 3.0) + (aytNet.physics * 2.85) + (aytNet.chemistry * 3.07) + (aytNet.biology * 3.07);

    // EA score = 100 base + TYT 40% + AYT EA (Mat:3.0, Edb:3.0, Tar1:2.8, Cog1:3.3)
    const aytEaRaw = 100 + tytContribution + (aytNet.math * 3.0) + (aytNet.literature * 3.0) + (aytNet.history * 2.8) + (aytNet.geography * 3.3);

    // SOZ score = 100 base + TYT 40% + AYT SOZ (Edb:3.0, Tar1:2.8, Cog1:3.3, Tar2:2.9, Cog2:2.9, Fel:3.0, Din:3.3)
    const aytSozRaw = 100 + tytContribution + (aytNet.literature * 3.0) + (aytNet.history * 2.8) + (aytNet.geography * 3.3) +
        ((aytNet.history2 || 0) * 2.91) + ((aytNet.geography2 || 0) * 2.91) + ((aytNet.philosophy || 0) * 3.0) + ((aytNet.religion || 0) * 3.33);

    const obpContribution = obp * 0.6;
    const tytPlacement = tytRaw + obpContribution;
    const aytSayPlacement = aytSayRaw + obpContribution;
    const aytEaPlacement = aytEaRaw + obpContribution;
    const aytSozPlacement = aytSozRaw + obpContribution;

    return {
        tytRaw: isNaN(tytRaw) ? 100 : Number(tytRaw.toFixed(2)),
        aytSayRaw: isNaN(aytSayRaw) ? 100 : Number(aytSayRaw.toFixed(2)),
        aytEaRaw: isNaN(aytEaRaw) ? 100 : Number(aytEaRaw.toFixed(2)),
        aytSozRaw: isNaN(aytSozRaw) ? 100 : Number(aytSozRaw.toFixed(2)),
        tytPlacement: isNaN(tytPlacement) ? 100 : Number(tytPlacement.toFixed(2)),
        aytSayPlacement: isNaN(aytSayPlacement) ? 100 : Number(aytSayPlacement.toFixed(2)),
        aytEaPlacement: isNaN(aytEaPlacement) ? 100 : Number(aytEaPlacement.toFixed(2)),
        aytSozPlacement: isNaN(aytSozPlacement) ? 100 : Number(aytSozPlacement.toFixed(2)),
    };
}

export function estimateRank(score: number, field: "SAY" | "EA" | "SOZ" | "TYT") {
    if (field === "TYT") {
        if (score >= 495) return "30 - 100";
        if (score >= 480) return "100 - 500";
        if (score >= 460) return "500 - 1.500";
        if (score >= 440) return "1.500 - 5.000";
        if (score >= 420) return "5.000 - 15.000";
        if (score >= 400) return "15.000 - 35.000";
        if (score >= 380) return "35.000 - 70.000";
        if (score >= 350) return "70.000 - 150.000";
        if (score >= 320) return "150.000 - 300.000";
        if (score >= 280) return "300.000 - 600.000";
        if (score >= 240) return "600.000 - 1.000.000";
        return "1.000.000+";
    }

    if (field === "SAY") {
        if (score >= 550) return "1 - 100";
        if (score >= 540) return "100 - 500";
        if (score >= 530) return "500 - 1.500";
        if (score >= 515) return "1.500 - 5.000";
        if (score >= 500) return "5.000 - 12.000";
        if (score >= 485) return "12.000 - 25.000";
        if (score >= 465) return "25.000 - 50.000";
        if (score >= 440) return "50.000 - 85.000";
        if (score >= 415) return "85.000 - 130.000";
        if (score >= 380) return "130.000 - 200.000";
        if (score >= 330) return "200.000 - 350.000";
        if (score >= 280) return "350.000 - 500.000";
        return "500.000+";
    } else if (field === "EA") {
        if (score >= 540) return "1 - 100";
        if (score >= 520) return "100 - 500";
        if (score >= 500) return "500 - 1.500";
        if (score >= 480) return "1.500 - 4.000";
        if (score >= 460) return "4.000 - 10.000";
        if (score >= 440) return "10.000 - 20.000";
        if (score >= 420) return "20.000 - 45.000";
        if (score >= 390) return "45.000 - 80.000";
        if (score >= 360) return "80.000 - 130.000";
        if (score >= 320) return "130.000 - 250.000";
        if (score >= 280) return "250.000 - 450.000";
        return "450.000+";
    } else {
        // SOZ Ranks
        if (score >= 530) return "1 - 100";
        if (score >= 510) return "100 - 500";
        if (score >= 490) return "500 - 1.500";
        if (score >= 470) return "1.500 - 4.500";
        if (score >= 450) return "4.500 - 12.000";
        if (score >= 430) return "12.000 - 25.000";
        if (score >= 410) return "25.000 - 50.000";
        if (score >= 380) return "50.000 - 100.000";
        if (score >= 340) return "100.000 - 250.000";
        if (score >= 290) return "250.000 - 500.000";
        return "500.000+";
    }
}


