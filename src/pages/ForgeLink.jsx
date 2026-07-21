import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Cable, Settings } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { isBridgeConfigured } from "@/lib/forgeBridge";
import BridgeSettings from "@/components/bridge/BridgeSettings";
import LiveFeed from "@/components/bridge/LiveFeed";
import HealthPanel from "@/components/bridge/HealthPanel";
import WrapsPanel from "@/components/bridge/WrapsPanel";
import LedgerPanel from "@/components/bridge/LedgerPanel";
import MintPanel from "@/components/bridge/MintPanel";
import ConcoctPanel from "@/components/bridge/ConcoctPanel";

export default function ForgeLink() {
  const [showSettings, setShowSettings] = useState(!isBridgeConfigured());
  const [connKey, setConnKey] = useState(0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-cyan-400 text-sm font-mono mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to the board
        </Link>

        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Cable className="h-6 w-6 text-cyan-400" />
              <h1 className="font-heading text-3xl tracking-tight">
                Forge Link <span className="text-zinc-500 font-light">· the glass</span>
              </h1>
            </div>
            <p className="text-zinc-500 text-sm font-mono">
              Read-only window into the Forge + gate-signed capability requests. No logic, no secrets held here.
            </p>
          </div>
          <button
            onClick={() => setShowSettings((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:border-zinc-700 transition-colors"
          >
            <Settings className="h-3.5 w-3.5" /> Connection
          </button>
        </header>

        {showSettings && (
          <div className="mb-8">
            <BridgeSettings onSaved={() => { setShowSettings(false); setConnKey((k) => k + 1); }} />
          </div>
        )}

        <Tabs defaultValue="feed" key={connKey}>
          <TabsList className="bg-zinc-900 border border-zinc-800 mb-6">
            <TabsTrigger value="feed">Live Feed</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="wraps">Wraps</TabsTrigger>
            <TabsTrigger value="ledger">Ledger</TabsTrigger>
            <TabsTrigger value="mint">Mint</TabsTrigger>
            <TabsTrigger value="concoct">Concoct</TabsTrigger>
          </TabsList>
          <TabsContent value="feed"><LiveFeed /></TabsContent>
          <TabsContent value="health"><HealthPanel /></TabsContent>
          <TabsContent value="wraps"><WrapsPanel /></TabsContent>
          <TabsContent value="ledger"><LedgerPanel /></TabsContent>
          <TabsContent value="mint"><MintPanel /></TabsContent>
          <TabsContent value="concoct"><ConcoctPanel /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}