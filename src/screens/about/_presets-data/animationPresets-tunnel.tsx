'use client';
import texts from '../_text-data/index.json';

type Vec3 = [number, number, number];

interface TunnelBoard {
  idx: number;
  startPosition: Vec3;
  finishedPosition: Vec3;
  forwardPosition: Vec3;
  startDelay: number;
  closedDelay: number;
  forwardDelay: number;
  startDuration: number;
  closedDuration: number;
  forwardDuration: number;
  mainText: string;
  subText: string;
  isActive: boolean;
}




function boardsData(gap: number, items: any[]): TunnelBoard[] {
  return [
    {
      idx: 200, startPosition: [-gap * 2 + 1.3, gap * 1 + 0.7, -100], finishedPosition: [(-gap * 2) + 2, (gap * 1) + 3, 3], forwardPosition: [-gap * 2, gap * 1, 60], startDelay: 0.23, closedDelay: 0.1, forwardDelay: 0.2, startDuration: 0.75, closedDuration: 1, forwardDuration: 1,
      mainText: items[0]?.title || texts.tunnel.bord1.mainText, subText: items[0]?.content || texts.tunnel.bord1.subText, isActive: true
    },
    {
      idx: 201, startPosition: [-gap * 1 - 0.9, gap * 0 - 0.5, -100], finishedPosition: [-gap * 1, 0, 2], forwardPosition: [-gap * 1, 0, 60], startDelay: 0.26, closedDelay: 0.22, forwardDelay: 0.2, startDuration: 0.75, closedDuration: 1, forwardDuration: 1,
      mainText: items[1]?.title || texts.tunnel.bord2.mainText, subText: items[1]?.content || texts.tunnel.bord2.subText, isActive: true
    },
    {
      idx: 202, startPosition: [0 + 0.2, gap * 1 - 0.8, -90], finishedPosition: [0, (gap * 1) + 7, 3], forwardPosition: [0, gap * 1, 60], startDelay: 0.1, closedDelay: 0.23, forwardDelay: 0.2, startDuration: 0.75, closedDuration: 1, forwardDuration: 1,
      mainText: items[2]?.title || texts.tunnel.bord3.mainText, subText: items[2]?.content || texts.tunnel.bord3.subText, isActive: true
    },
    {
      idx: 203, startPosition: [gap * 1 + 0.8, gap * 0 + 0.6, -130], finishedPosition: [(gap * 1) - 3, gap * 0, 2], forwardPosition: [gap * 1, gap * 0, 60], startDelay: 0.24, closedDelay: 0.1, forwardDelay: 0.2, startDuration: 0.75, closedDuration: 1, forwardDuration: 1,
      mainText: items[3]?.title || texts.tunnel.bord4.mainText, subText: items[3]?.content || texts.tunnel.bord3.subText, isActive: true
    },
    {
      idx: 204, startPosition: [gap * 2, gap * 1, -100], finishedPosition: [(gap * 2) - 4, (gap * 1) + 2, 3], forwardPosition: [gap * 2, gap * 1, 60], startDelay: 0.25, closedDelay: 0.1, forwardDelay: 0.2, startDuration: 0.75, closedDuration: 1, forwardDuration: 1,
      mainText: items[4]?.title || texts.tunnel.bord5.mainText, subText: items[4]?.content || texts.tunnel.bord5.subText, isActive: true
    },
    {
      idx: 205, startPosition: [gap * 1 - 0.7, -gap * 1 + 0.3, -100], finishedPosition: [(gap * 1) - 2, (-gap * 1) - 5, 3], forwardPosition: [gap * 1, -gap * 1, 60], startDelay: 0.26, closedDelay: 0.1, forwardDelay: 0.2, startDuration: 0.75, closedDuration: 1, forwardDuration: 1,
      mainText: items[5]?.title || texts.tunnel.bord6.mainText, subText: items[5]?.content || texts.tunnel.bord6.subText, isActive: true
    },
    {
      idx: 206, startPosition: [-gap * 1 - 0.5, -gap * 1 - 0.6, -100], finishedPosition: [(-gap * 1) - 2, (-gap * 1) - 5, 3], forwardPosition: [-gap * 1, -gap * 1, 60], startDelay: 0.27, closedDelay: 0.1, forwardDelay: 0.2, startDuration: 0.75, closedDuration: 1, forwardDuration: 1,
      mainText: items[6]?.title || texts.tunnel.bord7.mainText, subText: items[6]?.content || texts.tunnel.bord7.subText, isActive: true
    },

    // Порожні ближче до центру, з нормальною глибиною (z=200)
    { idx: 207, startPosition: [-gap * 3 + 1, 0 + 0.6, -90], finishedPosition: [-gap * 3 + 1, 0, 50], forwardPosition: [-gap * 3 + 1, 0, 60], startDelay: 0.35, closedDelay: 1, forwardDelay: 1, startDuration: 1, closedDuration: 1, forwardDuration: 1, mainText: "", subText: "", isActive: false },
    { idx: 208, startPosition: [gap * 3 - 1.2, 0 - 0.4, -90], finishedPosition: [gap * 3 - 1.2, 0, 50], forwardPosition: [gap * 3 - 1.2, 0, 60], startDelay: 0.4, closedDelay: 1, forwardDelay: 1, startDuration: 1, closedDuration: 1, forwardDuration: 1, mainText: "", subText: "", isActive: false },
    { idx: 209, startPosition: [0 + 0.5, -gap * 2 + 1, -90], finishedPosition: [0 + 0.5, -gap * 2, 50], forwardPosition: [0 + 0.5, -gap * 2, 60], startDelay: 0.45, closedDelay: 1, startDuration: 1, closedDuration: 1, forwardDuration: 1, forwardDelay: 1, mainText: "", subText: "", isActive: false },
    { idx: 210, startPosition: [0 - 0.4, gap * 3 - 1, -90], finishedPosition: [0 - 0.4, gap * 3, 50], forwardPosition: [0 - 0.4, gap * 3, 60], startDelay: 0.5, closedDelay: 1, forwardDelay: 1, startDuration: 1, closedDuration: 1, forwardDuration: 1, mainText: "", subText: "", isActive: false },
    { idx: 211, startPosition: [-gap * 2 - 0.2, -gap * 2 + 0.4, -100], finishedPosition: [-gap * 2 - 0.2, -gap * 2, 50], forwardPosition: [-gap * 2 - 0.2, -gap * 2, 60], startDelay: 0.55, closedDelay: 1, forwardDelay: 1, startDuration: 1, closedDuration: 1, forwardDuration: 1, mainText: "", subText: "", isActive: false },

    // порожні збоку, finishedPosition та forwardPosition z=200
    { idx: 212, startPosition: [-gap * 4 - 2.1, gap + 0.7, -90], finishedPosition: [-gap * 4 - 2.1, gap + 0.7, 50], forwardPosition: [-gap * 4 - 2.1, gap + 0.7, 60], startDelay: 0.60, closedDelay: 0.5, forwardDelay: 0.4, startDuration: 1, closedDuration: 1, forwardDuration: 1, mainText: "", subText: "", isActive: false },
    { idx: 213, startPosition: [gap * 4 + 2.3, -gap - 0.5, -90], finishedPosition: [gap * 4 + 2.3, -gap - 0.5, 50], forwardPosition: [gap * 4 + 2.3, -gap - 0.5, 60], startDelay: 0.65, closedDelay: 0.5, forwardDelay: 0.4, startDuration: 1, closedDuration: 1, forwardDuration: 1, mainText: "", subText: "", isActive: false },
    { idx: 214, startPosition: [-gap * 4 - 2.4, -gap * 1.3, -90], finishedPosition: [-gap * 4 - 2.4, -gap * 1.3, 50], forwardPosition: [-gap * 4 - 2.4, -gap * 1.3, 60], startDelay: 0.7, closedDelay: 0.5, forwardDelay: 0.4, startDuration: 1, closedDuration: 1, forwardDuration: 1, mainText: "", subText: "", isActive: false },

    { idx: 215, startPosition: [gap * 4 + 2.3, -gap - 0.5, -90], finishedPosition: [gap * 4, -gap - 0.5, -10], forwardPosition: [gap * 4 + 2.3, -gap - 0.5, 60], startDelay: 0.65, closedDelay: 0.2, forwardDelay: 1, startDuration: 1, closedDuration: 0.7, forwardDuration: 1, mainText: "", subText: "", isActive: false },
    { idx: 216, startPosition: [-gap * 4 - 2.4, -gap * 1.3, -90], finishedPosition: [-gap * 4, -gap * 1.3, -6], forwardPosition: [-gap * 4 - 2.4, -gap * 1.3, 60], startDelay: 0.60, closedDelay: 0.5, forwardDelay: 1, startDuration: 1, closedDuration: 1, forwardDuration: 1, mainText: "", subText: "", isActive: false },

    { idx: 217, startPosition: [gap + 30, -gap, -130], finishedPosition: [gap + 30, -gap, -33], forwardPosition: [gap + 30, -gap, 80], startDelay: 0.8, closedDelay: 0, forwardDelay: 0, startDuration: 1, closedDuration: 0.75, forwardDuration: 1, mainText: "1", subText: "1", isActive: false },
    { idx: 218, startPosition: [-2, gap + 7, -145], finishedPosition: [-2, gap + 7, -45], forwardPosition: [-gap + -10, gap + 7, 80], startDelay: 0.6, closedDelay: 0, forwardDelay: 0, startDuration: 1, closedDuration: 0.75, forwardDuration: 1, mainText: "2", subText: "2", isActive: false },
    { idx: 219, startPosition: [-12, -(gap + 17), -200], finishedPosition: [-12, -(gap + 17), -80], forwardPosition: [-12, -(gap + 17), 60], startDelay: 0.6, closedDelay: 0, forwardDelay: 0, startDuration: 1, closedDuration: 0.75, forwardDuration: 0.5, mainText: "2", subText: "2", isActive: false },
  ];
};






export default {
  dec: boardsData,
  mob: boardsData,
  name: 'section Tunnel',
  sizeBordDec: 5.5,
  gapBordDec: 98,
  sizeBordMob: 5.5,
  gapBordMob: 98

}