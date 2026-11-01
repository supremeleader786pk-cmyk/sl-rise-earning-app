import React, { useState } from 'react';
import { X, Code2, Copy, Check, Download, Smartphone, Layers, ShieldCheck } from 'lucide-react';

interface KotlinNativeSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KOTLIN_FILES = [
  {
    name: 'MainActivity.kt',
    path: 'app/src/main/java/com/supremeleader/rise/MainActivity.kt',
    language: 'kotlin',
    content: `package com.supremeleader.rise

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.supremeleader.rise.ui.theme.SupremeLeaderRiseTheme
import com.supremeleader.rise.ui.navigation.RiseNavGraph

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SupremeLeaderRiseTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    RiseNavGraph()
                }
            }
        }
    }
}`
  },
  {
    name: 'Theme.kt',
    path: 'app/src/main/java/com/supremeleader/rise/ui/theme/Theme.kt',
    language: 'kotlin',
    content: `package com.supremeleader.rise.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Premium Gold & Obsidian Black Color Palette
val GoldPrimary = Color(0xFFF59E0B)
val GoldSecondary = Color(0xFFD4AF37)
val GoldTertiary = Color(0xFFFFD700)
val ObsidianBackground = Color(0xFF09090B)
val ObsidianSurface = Color(0xFF121217)
val ObsidianCard = Color(0xFF18181F)
val GoldBorder = Color(0x40D4AF37)

private val DarkColorScheme = darkColorScheme(
    primary = GoldPrimary,
    secondary = GoldSecondary,
    tertiary = GoldTertiary,
    background = ObsidianBackground,
    surface = ObsidianSurface,
    surfaceVariant = ObsidianCard,
    onPrimary = Color.Black,
    onSecondary = Color.Black,
    onBackground = Color.White,
    onSurface = Color.White
)

@Composable
fun SupremeLeaderRiseTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}`
  },
  {
    name: 'DashboardScreen.kt',
    path: 'app/src/main/java/com/supremeleader/rise/ui/screens/DashboardScreen.kt',
    language: 'kotlin',
    content: `package com.supremeleader.rise.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.supremeleader.rise.ui.theme.*

@Composable
fun DashboardScreen(
    balance: Double = 2850.0,
    todayEarnings: Double = 420.0,
    totalReferrals: Int = 14,
    onWatchAdsClick: () -> Unit,
    onQuizClick: () -> Unit,
    onWithdrawClick: () -> Unit,
    onDailyBonusClick: () -> Unit
) {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(ObsidianBackground)
            .statusBarsPadding()
            .navigationBarsPadding()
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        // Top Switch Board Wallet Card
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = ObsidianCard),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, GoldBorder, RoundedCornerShape(24.dp))
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = "TOTAL WALLET BALANCE",
                    color = Color.Gray,
                    fontSize = 11.sp,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "Rs. \${"%,.2f".format(balance)} PKR",
                    color = GoldTertiary,
                    fontSize = 28.sp,
                    style = MaterialTheme.typography.headlineLarge
                )

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text(text = "Today Earning", color = Color.Gray, fontSize = 11.sp)
                        Text(text = "+Rs. \${"%,.0f".format(todayEarnings)}", color = Color(0xFF34D399), fontSize = 16.sp)
                    }
                    Column {
                        Text(text = "Total Referrals", color = Color.Gray, fontSize = 11.sp)
                        Text(text = "$totalReferrals Members", color = GoldPrimary, fontSize = 16.sp)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Halal Guarantee Banner
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F1E13)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = "100% Halal - No Gambling, No Interest, Only Tasks & Referral",
                color = Color(0xFF34D399),
                fontSize = 12.sp,
                modifier = Modifier.padding(12.dp)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Daily Check-in Button
        Button(
            onClick = onDailyBonusClick,
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = GoldPrimary),
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(text = "Claim Daily Bonus (Streak Day 2/7)", color = Color.Black)
        }
    }
}`
  },
  {
    name: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    id("com.google.gms.google-services")
}

android {
    namespace = "com.supremeleader.rise"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.supremeleader.rise"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "3.4.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

dependencies {
    implementation(platform("com.google.firebase:firebase-bom:33.7.0"))
    implementation("com.google.firebase:firebase-auth-ktx")
    implementation("com.google.firebase:firebase-firestore-ktx")
    implementation("androidx.compose.material3:material3:1.3.1")
    implementation("androidx.navigation:navigation-compose:2.8.5")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
}`
  },
  {
    name: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Supreme Leader RISE"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@android:style/Theme.Material.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
  }
];

export const KotlinNativeSourceModal: React.FC<KotlinNativeSourceModalProps> = ({ isOpen, onClose }) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = KOTLIN_FILES[activeFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111116] border border-amber-500/40 rounded-3xl p-5 shadow-2xl text-white flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <span>Native Android Kotlin Codebase</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40">
                  Jetpack Compose
                </span>
              </h3>
              <p className="text-xs text-zinc-400">Production ready for Android Studio & Gradle release build</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-1.5 overflow-x-auto py-2.5 border-b border-zinc-800 text-xs">
          {KOTLIN_FILES.map((file, idx) => (
            <button
              key={file.name}
              onClick={() => setActiveFileIndex(idx)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[11px] whitespace-nowrap transition flex items-center gap-1.5 ${
                idx === activeFileIndex
                  ? 'bg-amber-500 text-black font-bold shadow-sm'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{file.name}</span>
            </button>
          ))}
        </div>

        {/* File Path & Copy Toolbar */}
        <div className="flex items-center justify-between py-2 text-[11px] text-zinc-400">
          <span className="font-mono text-zinc-500 truncate mr-2">{currentFile.path}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto bg-[#0a0a0d] border border-zinc-800/80 rounded-xl p-3.5 font-mono text-xs text-zinc-300 leading-relaxed">
          <pre>{currentFile.content}</pre>
        </div>

        {/* Android Build Instructions */}
        <div className="mt-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Target SDK 35 • Min SDK 24 • Material 3 • 100% Mobile Ready</span>
          </div>
          <button
            onClick={() => {
              const element = document.createElement('a');
              const file = new Blob([currentFile.content], { type: 'text/plain' });
              element.href = URL.createObjectURL(file);
              element.download = currentFile.name;
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {currentFile.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
