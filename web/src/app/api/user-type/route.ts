import { NextResponse } from "next/server";
import { auth, db } from "@/controller";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export async function GET() {
  try {
    const current = getAuth().currentUser;
    if (!current) {
      return NextResponse.json({ type: null }, { status: 200 });
    }
    const snap = await getDoc(doc(db, "users", current.uid));
    const type = snap.exists() ? (snap.data() as any).type : null;
    return NextResponse.json({ type }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ type: null }, { status: 200 });
  }
}


