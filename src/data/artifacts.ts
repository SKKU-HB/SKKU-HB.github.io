export interface ArtifactItem {
  name: string;
  behavior: string;
  path: string;
}

export interface Artifact {
  id: string;
  category: string;
  purpose: string;
  level: string;
  artifacts: ArtifactItem[];
  tools: string | null;
  dataNeeded: string | null;
  summary: string | null;
}

export const artifacts: Artifact[] = [
  {
    "id": "ub_inv_basic",
    "category": "사용자 행위",
    "purpose": "수사 조사",
    "level": "초급",
    "artifacts": [
      { "name": "Prefetch", "behavior": "프로그램 실행 여부 확인", "path": "C:\\Windows\\Prefetch\\*.pf" },
      { "name": "$MFT", "behavior": "파일 생성·수정 시간", "path": "C:\\$MFT (Raw 접근 필요)" },
      { "name": "LNK", "behavior": "최근 실행 파일", "path": "C:\\Users\\<사용자>\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\*.lnk" },
      { "name": "Event Log (EVTX)", "behavior": "로그인, 실행 이벤트", "path": "C:\\Windows\\System32\\winevt\\Logs\\*.evtx" }
    ],
    "tools": "Autopsy, FTK Imager",
    "dataNeeded": "Prefetch 폴더, $MFT, LNK 파일, EVTX 로그 파일",
    "summary": "사용자가 “무엇을 했는지” 대략적으로 확인하는 단계"
  },
  {
    "id": "ub_inv_intermediate",
    "category": "사용자 행위",
    "purpose": "수사 조사",
    "level": "중급",
    "artifacts": [
      { "name": "Prefetch + Amcache", "behavior": "실행 여부 + 파일 정보", "path": "C:\\Windows\\Prefetch\\*.pf + C:\\Windows\\AppCompat\\Programs\\Amcache.hve" },
      { "name": "$MFT + $UsnJrnl", "behavior": "파일 수정·삭제 추적", "path": "C:\\$MFT (Raw 접근 필요) + C:\\$Extend\\$UsnJrnl" },
      { "name": "LNK + Jump List", "behavior": "프로그램 및 파일 사용 흐름", "path": "C:\\Users\\<사용자>\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\*.lnk + C:\\Users\\<사용자>\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\AutomaticDestinations\\ / CustomDestinations\\" },
      { "name": "Event Log (EVTX)", "behavior": "행위 시간 및 이벤트", "path": "C:\\Windows\\System32\\winevt\\Logs\\*.evtx" }
    ],
    "tools": "PECmd (Prefetch 분석), AmcacheParser, MFTECmd, UsnJrnl2Csv, Registry Explorer, KAPE",
    "dataNeeded": "Prefetch, Amcache.hve, $MFT, $UsnJrnl, Jump List, Registry, EVTX",
    "summary": "“언제, 어떻게 했는지” 행위의 맥락을 분석하는 단계"
  },
  {
    "id": "ub_inv_advanced",
    "category": "사용자 행위",
    "purpose": "수사 조사",
    "level": "고급",
    "artifacts": [
      { "name": "Prefetch + Amcache + ShimCache", "behavior": "과거 실행 흔적 포함", "path": "C:\\Windows\\Prefetch\\*.pf + C:\\Windows\\AppCompat\\Programs\\Amcache.hve + C:\\Windows\\System32\\config\\SYSTEM" },
      { "name": "$MFT + $UsnJrnl", "behavior": "전체 파일 흐름 분석", "path": "C:\\$MFT (Raw 접근 필요) + C:\\$Extend\\$UsnJrnl" },
      { "name": "LNK + Jump List + Shellbags", "behavior": "GUI 기반 사용자 행동 포함", "path": "C:\\Users\\<사용자>\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\*.lnk + C:\\Users\\<사용자>\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\AutomaticDestinations\\ / CustomDestinations\\ + C:\\Users\\<사용자>\\NTUSER.DAT / UsrClass.dat" },
      { "name": "Event Log (EVTX)", "behavior": "전체 이벤트 연결", "path": "C:\\Windows\\System32\\winevt\\Logs\\*.evtx" }
    ],
    "tools": "log2timeline (Plaso), The Sleuth Kit (TSK), RECmd, Timeline Explorer, Velociraptor",
    "dataNeeded": "전체 파일시스템 이미지, Registry, Prefetch, 로그, Shellbags 등 모든 아티팩트",
    "summary": "사용자 행동의 “전체 흐름(타임라인)”을 재구성하는 단계"
  },
  {
    "id": "ub_ir_basic",
    "category": "사용자 행위",
    "purpose": "보안 침해 분석",
    "level": "초급",
    "artifacts": [
      { "name": "Prefetch", "behavior": "프로그램 실행 여부 확인", "path": "C:\\Windows\\Prefetch\\*.pf" },
      { "name": "Run / Startup Registry", "behavior": "자동 실행 프로그램", "path": "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run / HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" }
    ],
    "tools": "Autoruns, Process Explorer, WinPrefetchView",
    "dataNeeded": "Prefetch 폴더, Registry (Run / Startup 키)",
    "summary": "“의심 프로그램이 실행됐는지” 빠르게 확인하는 단계"
  },
  {
    "id": "ub_ir_intermediate",
    "category": "사용자 행위",
    "purpose": "보안 침해 분석",
    "level": "중급",
    "artifacts": [
      { "name": "Prefetch + Amcache", "behavior": "실행 여부 + 파일 경로/해시", "path": "C:\\Windows\\Prefetch\\*.pf + C:\\Windows\\AppCompat\\Programs\\Amcache.hve" },
      { "name": "Run / Startup Registry", "behavior": "지속성 여부 확인", "path": "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run / HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" },
      { "name": "SRUM, BAM/DAM", "behavior": "프로그램 실행 시간 및 사용 패턴", "path": "C:\\Windows\\System32\\sru\\SRUDB.dat + HKLM\\SYSTEM\\CurrentControlSet\\Services\\bam\\UserSettings\\" },
      { "name": "Event Log (4688)", "behavior": "프로세스 실행 기록", "path": "C:\\Windows\\System32\\winevt\\Logs\\*.evtx" },
      { "name": "$MFT", "behavior": "파일 생성/삭제 흔적", "path": "C:\\$MFT (Raw 접근 필요)" }
    ],
    "tools": "PECmd, AmcacheParser, KAPE, Registry Explorer",
    "dataNeeded": "Prefetch, Amcache.hve, Registry, SRUM DB, BAM/DAM, EVTX, $MFT",
    "summary": "“악성 실행 + 지속성 확보 여부”를 분석하는 단계"
  },
  {
    "id": "ub_ir_advanced",
    "category": "사용자 행위",
    "purpose": "보안 침해 분석",
    "level": "고급",
    "artifacts": [
      { "name": "Prefetch + Amcache + ShimCache", "behavior": "실행 + 과거 흔적 + 우회 흔적", "path": "C:\\Windows\\Prefetch\\*.pf + C:\\Windows\\AppCompat\\Programs\\Amcache.hve + C:\\Windows\\System32\\config\\SYSTEM" },
      { "name": "Run / Startup + ShimCache", "behavior": "지속성 확보 분석", "path": "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run / HKLM\\... + C:\\Windows\\System32\\config\\SYSTEM" },
      { "name": "SRUM, BAM/DAM", "behavior": "장시간 실행 및 백그라운드 활동", "path": "C:\\Windows\\System32\\sru\\SRUDB.dat + HKLM\\SYSTEM\\CurrentControlSet\\Services\\bam\\UserSettings\\" },
      { "name": "Event Log (4688)", "behavior": "부모-자식 프로세스 체인", "path": "C:\\Windows\\System32\\winevt\\Logs\\*.evtx" },
      { "name": "$MFT", "behavior": "파일 생성 → 실행 → 삭제 흐름", "path": "C:\\$MFT (Raw 접근 필요)" }
    ],
    "tools": "Velociraptor, RECmd, MFTECmd, YARA (악성 탐지), Sysmon + 로그 분석, Chainsaw / Hayabusa",
    "dataNeeded": "전체 디스크 이미지, Registry, Sysmon 로그, EVTX, Prefetch, Amcache, ShimCache 등",
    "summary": "공격의 “전체 흐름 + TTP(행위 패턴)”을 재구성하는 단계"
  },
  {
    "id": "ub_edu_basic",
    "category": "사용자 행위",
    "purpose": "기본 보안",
    "level": "초급",
    "artifacts": [
      { "name": "Recent Files", "behavior": "최근 열어본 파일", "path": "C:\\Users\\<사용자>\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\" },
      { "name": "Prefetch", "behavior": "실행된 프로그램", "path": "C:\\Windows\\Prefetch\\*.pf" },
      { "name": "LNK", "behavior": "최근 실행 파일", "path": "C:\\Users\\<사용자>\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\*.lnk" },
      { "name": "Event Log", "behavior": "로그인 및 기본 활동", "path": "C:\\Windows\\System32\\winevt\\Logs\\*.evtx" }
    ],
    "tools": "Autopsy, WinPrefetchView, LastActivityView",
    "dataNeeded": "Recent Files, Prefetch 폴더, LNK 파일, EVTX 로그",
    "summary": "“내가 최근 무엇을 했는지” 직관적으로 확인하는 단계"
  },
  {
    "id": "ub_edu_intermediate",
    "category": "사용자 행위",
    "purpose": "기본 보안",
    "level": "중급",
    "artifacts": [
      { "name": "Recent Files + Jump List", "behavior": "프로그램별 파일 사용 이력", "path": "C:\\Users\\<사용자>\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\ + AutomaticDestinations\\" },
      { "name": "Prefetch", "behavior": "실행 횟수 및 시간 분석", "path": "C:\\Windows\\Prefetch\\*.pf" },
      { "name": "LNK + Jump List", "behavior": "파일-프로그램 연결 분석", "path": "C:\\Users\\<사용자>\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\*.lnk + AutomaticDestinations\\" },
      { "name": "Shellbags", "behavior": "탐색한 폴더 기록", "path": "C:\\Users\\<사용자>\\NTUSER.DAT / C:\\Users\\<사용자>\\AppData\\Local\\Microsoft\\Windows\\UsrClass.dat" }
    ],
    "tools": "PECmd, JLECmd, Shellbags Explorer",
    "dataNeeded": "Prefetch, Jump List, LNK, Shellbags (Registry)",
    "summary": "“사용 패턴과 흐름”을 이해하는 단계"
  },
  {
    "id": "ub_edu_advanced",
    "category": "사용자 행위",
    "purpose": "기본 보안",
    "level": "고급",
    "artifacts": [
      { "name": "LNK + Jump List + Shellbags", "behavior": "파일 + 폴더 + GUI 행동 통합", "path": "C:\\Users\\<사용자>\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\*.lnk + AutomaticDestinations\\ + NTUSER.DAT" },
      { "name": "Prefetch", "behavior": "프로그램 실행 흐름", "path": "C:\\Windows\\Prefetch\\*.pf" },
      { "name": "Event Log", "behavior": "전체 활동 기록 연결", "path": "C:\\Windows\\System32\\winevt\\Logs\\*.evtx" },
      { "name": "타임라인 데이터", "behavior": "행동 흐름 통합 분석", "path": "$MFT, $UsnJrnl, Prefetch, Amcache, LNK, Jump List, Shellbags, Event Log(EVTX), SRUM, BAM/DAM" }
    ],
    "tools": "Timeline Explorer, Plaso, Python 분석 (커스텀 분석)",
    "dataNeeded": "전체 아티팩트 (Prefetch, LNK, Jump List, Registry, EVTX 등)",
    "summary": "사용자 행동을 기반으로 “전체 활동 흐름”을 구조적으로 이해하는 단계"
  },
  {
    "id": "reg_inv_basic",
    "category": "레지스트리 분석",
    "purpose": "수사 조사",
    "level": "초급",
    "artifacts": [
      { "name": "SAM (Security Account Manager)", "behavior": "사용자 계정 정보", "path": "C:\\Windows\\System32\\config\\SAM" },
      { "name": "SECURITY 하이브", "behavior": "보안 설정 정보", "path": "C:\\Windows\\System32\\config\\SECURITY" },
      { "name": "SOFTWARE 하이브", "behavior": "소프트웨어 설정", "path": "C:\\Windows\\System32\\config\\SOFTWARE" },
      { "name": "SYSTEM 하이브", "behavior": "시스템 구성", "path": "C:\\Windows\\System32\\config\\SYSTEM" },
      { "name": "NTUSER.DAT", "behavior": "사용자별 설정", "path": "C:\\Users\\[사용자명]\\NTUSER.DAT" },
      { "name": "최근 문서 목록", "behavior": "최근 활동 흔적", "path": "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\RecentDocs" }
    ],
    "tools": "Windows 기본 regedit.exe, RegScanner (NirSoft)",
    "dataNeeded": "라이브 시스템 접근 권한, 검색 대상 문자열 (악성코드 이름, IP 주소 등)",
    "summary": "레지스트리 기본 구조와 주요 하이브 위치를 파악하여 사용자 계정, 시스템 설정, 최근 활동 흔적을 확인하는 것이 기본이다."
  },
  {
    "id": "reg_inv_intermediate",
    "category": "레지스트리 분석",
    "purpose": "수사 조사",
    "level": "중급",
    "artifacts": [
      { "name": "UserAssist 데이터", "behavior": "프로그램 실행 이력", "path": "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\UserAssist" },
      { "name": "ShellBags", "behavior": "폴더 탐색 기록", "path": "NTUSER.DAT 및 USRCLASS.DAT 내 관련 키" },
      { "name": "Prefetch 파일", "behavior": "프로그램 실행 횟수/시간", "path": "C:\\Windows\\Prefetch\\*.pf" },
      { "name": "Amcache.hve", "behavior": "프로그램 설치/실행 기록", "path": "C:\\Windows\\AppCompat\\Programs\\Amcache.hve" },
      { "name": "Shimcache", "behavior": "과거 실행 흔적", "path": "SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache" }
    ],
    "tools": "UserAssist 디코딩 (PowerShell), WinPrefetchView, AmcacheParser",
    "dataNeeded": "UserAssist 레지스트리 값, Prefetch 파일 (*.pf), Amcache.hve 파일",
    "summary": "UserAssist, Prefetch, Amcache 등을 분석하여 사용자의 프로그램 실행 이력과 타임라인을 정교하게 재구성할 수 있다."
  },
  {
    "id": "reg_inv_advanced",
    "category": "레지스트리 분석",
    "purpose": "수사 조사",
    "level": "고급",
    "artifacts": [
      { "name": "레지스트리 하이브 파일", "behavior": "오프라인 하이브 분석", "path": "C:\\Windows\\System32\\config\\SYSTEM, SOFTWARE, SAM, SECURITY" },
      { "name": "트랜잭션 로그 파일", "behavior": "변경 이력 추적", "path": "C:\\Windows\\System32\\config\\*.LOG, .LOG1, .LOG2" },
      { "name": "VSS 스냅샷 내 레지스트리", "behavior": "과거 레지스트리 복원", "path": "VSS 마운트 경로 내 Windows\\System32\\config\\" }
    ],
    "tools": "RegRipper, Registry Explorer, KAPE",
    "dataNeeded": "추출된 레지스트리 하이브 파일, 대상 시스템 전체 또는 특정 디렉터리",
    "summary": "오프라인 하이브 분석과 VSS 스냅샷 활용을 통해 삭제되거나 변경된 레지스트리 흔적까지 복원하여 심층 수사를 수행할 수 있다."
  },
  {
    "id": "auth_inv_basic",
    "category": "계정 및 인증 분석",
    "purpose": "수사 조사",
    "level": "초급",
    "artifacts": [
      { "name": "로그인 기록", "behavior": "성공/실패 로그인 추적", "path": "C:\\Windows\\System32\\winevt\\Logs\\Security.evtx (ID 4624, 4625)" },
      { "name": "SAM 데이터베이스", "behavior": "로컬 사용자 계정 정보", "path": "C:\\Windows\\System32\\config\\SAM" }
    ],
    "tools": "Event Viewer (eventvwr.msc), net user 명령어",
    "dataNeeded": "Security.evtx 로그 파일, 로컬 사용자 계정명",
    "summary": "Event Viewer와 기본 명령어를 활용하여 로그인 성공/실패 이력을 확인하고 비정상적인 접근 시도를 초기 탐지할 수 있다."
  },
  {
    "id": "auth_inv_intermediate",
    "category": "계정 및 인증 분석",
    "purpose": "수사 조사",
    "level": "중급",
    "artifacts": [
      { "name": "로그인 실패/잠금 기록", "behavior": "무차별 대입 탐지", "path": "Security.evtx (ID 4625, 4740)" },
      { "name": "Credential Manager", "behavior": "저장된 자격 증명 확인", "path": "C:\\Users\\[사용자명]\\AppData\\Local/Roaming\\Microsoft\\Credentials\\" }
    ],
    "tools": "Event Viewer (고급 필터링), Mimikatz, CredentialFileView",
    "dataNeeded": "Security.evtx, 관리자 권한, 메모리 덤프 또는 SAM/SECURITY 하이브, Credentials 폴더",
    "summary": "로그인 실패 패턴과 저장된 자격 증명을 분석하여 무차별 대입 공격 시도 및 자격 증명 탈취 흔적을 탐지할 수 있다."
  },
  {
    "id": "auth_inv_advanced",
    "category": "계정 및 인증 분석",
    "purpose": "수사 조사",
    "level": "고급",
    "artifacts": [
      { "name": "NTLM 해시", "behavior": "자격 증명 탈취 흔적", "path": "C:\\Windows\\System32\\config\\SAM" },
      { "name": "Kerberos 티켓", "behavior": "Golden/Silver Ticket 공격", "path": "메모리 내 티켓 캐시" },
      { "name": "로그온 세션 정보", "behavior": "고급 인증 추적", "path": "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Authentication\\LogonUI" },
      { "name": "LSA Secrets", "behavior": "민감한 시스템 자격 증명", "path": "C:\\Windows\\System32\\config\\SECURITY" }
    ],
    "tools": "Mimikatz (고급 기능), PowerShell (Get-WinEvent), Volatility Framework",
    "dataNeeded": "관리자 권한, 메모리 덤프, SAM/SECURITY 하이브, Security.evtx",
    "summary": "메모리 포렌식과 NTLM 해시 분석을 통해 Pass-the-Hash, Golden Ticket 등 고급 공격 기법의 흔적을 식별하고 침해 범위를 정확히 파악할 수 있다."
  },
  {
    "id": "sys_inv_basic",
    "category": "시스템 정보 분석",
    "purpose": "수사 조사",
    "level": "초급",
    "artifacts": [
      { "name": "OS 설치 정보", "behavior": "운영체제 기본 정보", "path": "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" },
      { "name": "시스템 정보", "behavior": "하드웨어 및 부팅 정보", "path": "C:\\Windows\\System32\\systeminfo.exe" },
      { "name": "Timezone 설정", "behavior": "시간대 확인", "path": "HKLM\\SYSTEM\\CurrentControlSet\\Control\\TimeZoneInformation" },
      { "name": "Computer Name", "behavior": "기기 식별", "path": "HKLM\\SYSTEM\\CurrentControlSet\\Control\\ComputerName\\ComputerName" }
    ],
    "tools": "msinfo32, systeminfo 명령어",
    "dataNeeded": "라이브 시스템 접근, 명령 프롬프트 접근",
    "summary": "기본 시스템 정보 도구를 활용하여 OS 버전, 설치 날짜, 시간대, 컴퓨터 이름 등을 빠르게 확인하고 수사 기초 자료를 수집할 수 있다."
  },
  {
    "id": "sys_inv_intermediate",
    "category": "시스템 정보 분석",
    "purpose": "수사 조사",
    "level": "중급",
    "artifacts": [
      { "name": "설치된 프로그램 목록", "behavior": "소프트웨어 흔적", "path": "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall" },
      { "name": "실행 중인 서비스", "behavior": "백그라운드 영속성", "path": "HKLM\\SYSTEM\\CurrentControlSet\\Services" },
      { "name": "예약된 작업", "behavior": "스케줄링된 악성 행위", "path": "C:\\Windows\\System32\\Tasks\\" }
    ],
    "tools": "services.msc, Task Scheduler, Autoruns",
    "dataNeeded": "라이브 시스템 접근, 오프라인 하이브",
    "summary": "설치된 프로그램, 실행 중인 서비스, 예약된 작업을 종합 분석하여 악성 소프트웨어의 영속성 확보 메커니즘을 파악할 수 있다."
  },
  {
    "id": "sys_inv_advanced",
    "category": "시스템 정보 분석",
    "purpose": "수사 조사",
    "level": "고급",
    "artifacts": [
      { "name": "VSS 스냅샷", "behavior": "과거 파일/상태 복원", "path": "VSS 마운트 경로" },
      { "name": "트랜잭션 로그", "behavior": "변경 이력 추적", "path": "C:\\Windows\\System32\\config\\*.LOG, .LOG1, .LOG2" },
      { "name": "NTFS $MFT / $LogFile", "behavior": "파일시스템 메타데이터 분석", "path": "C:\\$MFT, C:\\$LogFile" }
    ],
    "tools": "vssadmin, ShadowExplorer, MFTECmd, LogFileParser",
    "dataNeeded": "관리자 권한, VSS 스냅샷, $MFT 파일, $LogFile",
    "summary": "VSS 스냅샷과 NTFS 메타데이터를 분석하여 삭제된 파일 복원, 타임라인 재구성, 파일 시스템 변경 이력 추적을 통해 심층 수사를 완성할 수 있다."
  },
  {
    "id": "reg_ir_basic",
    "category": "레지스트리 분석",
    "purpose": "보안 침해 분석",
    "level": "초급",
    "artifacts": [
      { "name": "자동 실행 프로그램", "behavior": "초기 영속성 확인", "path": "HKCU/HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run(Once)" },
      { "name": "서비스 등록 정보", "behavior": "서비스 위장 악성코드", "path": "HKLM\\SYSTEM\\CurrentControlSet\\Services" },
      { "name": "WinLogon 항목", "behavior": "로그온 시 실행", "path": "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon" }
    ],
    "tools": "regedit.exe, Autoruns",
    "dataNeeded": "라이브 시스템 접근, 오프라인 하이브",
    "summary": "자동 실행 레지스트리 키와 서비스 등록 정보를 점검하여 악성코드의 영속성 확보 시도를 초기 단계에서 탐지할 수 있다."
  },
  {
    "id": "reg_ir_intermediate",
    "category": "레지스트리 분석",
    "purpose": "보안 침해 분석",
    "level": "중급",
    "artifacts": [
      { "name": "실시간 변경 로그", "behavior": "실시간 레지스트리 조작", "path": "Process Monitor 캡처 로그" },
      { "name": "AppInit_DLLs / IFEO", "behavior": "DLL 인젝션 및 프로세스 하이재킹", "path": "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Windows\\AppInit_DLLs 및 IFEO" },
      { "name": "BHO", "behavior": "브라우저 악성 확장", "path": "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Browser Helper Objects" }
    ],
    "tools": "Process Monitor, RegShot, Autoruns (고급 필터링)",
    "dataNeeded": "라이브 시스템 실행 권한, 레지스트리 스냅샷",
    "summary": "레지스트리 실시간 모니터링과 스냅샷 비교를 통해 악성코드의 은밀한 레지스트리 변경 시도를 탐지하고 침해 범위를 파악할 수 있다."
  },
  {
    "id": "reg_ir_advanced",
    "category": "레지스트리 분석",
    "purpose": "보안 침해 분석",
    "level": "고급",
    "artifacts": [
      { "name": "트랜잭션 로그", "behavior": "은폐된 변경 추적", "path": "C:\\Windows\\System32\\config\\*.LOG" },
      { "name": "VSS 스냅샷 내 레지스트리", "behavior": "과거 상태 비교", "path": "VSS 마운트 경로 내 Windows\\System32\\config\\" },
      { "name": "Deleted Registry Keys", "behavior": "삭제된 설정 복원", "path": "레지스트리 하이브 내 슬랙 공간" }
    ],
    "tools": "RegRipper (플러그인), Registry Explorer, KAPE",
    "dataNeeded": "레지스트리 하이브 파일, 대상 시스템 전체",
    "summary": "레지스트리 트랜잭션 로그와 VSS 스냅샷 분석, 삭제된 키 복원을 통해 공격자의 은폐 시도를 간파하고 침해 사고의 전체 타임라인을 재구성할 수 있다."
  },
  {
    "id": "auth_ir_basic",
    "category": "계정 및 인증 분석",
    "purpose": "보안 침해 분석",
    "level": "초급",
    "artifacts": [
      { "name": "활성/비활성 사용자 계정", "behavior": "백도어 계정 확인", "path": "C:\\Windows\\System32\\config\\SAM" },
      { "name": "로컬 그룹 정책", "behavior": "권한 설정 변경 확인", "path": "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies" }
    ],
    "tools": "net user 명령어, lusrmgr.msc",
    "dataNeeded": "명령 프롬프트 접근, 라이브 시스템 접근",
    "summary": "활성 및 비활성 계정 상태를 점검하여 불필요한 계정을 제거하고 공격 표면을 줄일 수 있다."
  },
  {
    "id": "auth_ir_intermediate",
    "category": "계정 및 인증 분석",
    "purpose": "보안 침해 분석",
    "level": "중급",
    "artifacts": [
      { "name": "로그인 실패/잠금 이벤트", "behavior": "무차별 대입 탐지", "path": "이벤트 ID: 4625, 4740" },
      { "name": "비정상 로그인 위치/시간대", "behavior": "원격 침해 확인", "path": "이벤트 ID: 4624 (Logon Type, IP 분석)" }
    ],
    "tools": "Event Viewer (고급 필터링), PowerShell (Get-WinEvent 고급)",
    "dataNeeded": "Security.evtx",
    "summary": "로그인 실패 패턴과 계정 잠금 이벤트를 분석하여 무차별 대입 공격 및 자격 증명 탈취 시도를 탐지하고 대응할 수 있다."
  },
  {
    "id": "auth_ir_advanced",
    "category": "계정 및 인증 분석",
    "purpose": "보안 침해 분석",
    "level": "고급",
    "artifacts": [
      { "name": "SIEM 로그", "behavior": "전사적 이상 징후 분석", "path": "SIEM 서버 (Splunk, ELK 등)" },
      { "name": "Kerberos 인증 로그", "behavior": "고도화된 인증 우회", "path": "이벤트 ID: 4768, 4769" },
      { "name": "PTH / Golden Ticket 흔적", "behavior": "해시 및 권한 탈취", "path": "이벤트 ID: 4624 (Type 3, 9), 4672" }
    ],
    "tools": "Splunk / ELK Stack (SIEM), Mimikatz, DeepBlueCLI",
    "dataNeeded": "모든 시스템 로그, 메모리 덤프 또는 라이브 시스템, Security.evtx",
    "summary": "SIEM 시스템과 고급 분석 도구를 활용하여 Pass-the-Hash, Golden Ticket 등 고도화된 인증 공격을 탐지하고 침해 사고를 신속히 대응할 수 있다."
  },
  {
    "id": "sys_ir_basic",
    "category": "시스템 정보 분석",
    "purpose": "보안 침해 분석",
    "level": "초급",
    "artifacts": [
      { "name": "보안 소프트웨어 설치", "behavior": "보안 솔루션 우회 여부", "path": "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall" },
      { "name": "Windows Defender 상태", "behavior": "백신 무력화 확인", "path": "HKLM\\SOFTWARE\\Microsoft\\Windows Defender" },
      { "name": "방화벽 설정", "behavior": "포트 개방 확인", "path": "netsh advfirewall show allprofiles" }
    ],
    "tools": "msinfo32, Get-MpComputerStatus (PowerShell)",
    "dataNeeded": "라이브 시스템 접근",
    "summary": "보안 소프트웨어 설치 및 업데이트 상태를 점검하여 기본 보안 태세를 확인하고 취약점을 조기에 발견할 수 있다."
  },
  {
    "id": "sys_ir_intermediate",
    "category": "시스템 정보 분석",
    "purpose": "보안 침해 분석",
    "level": "중급",
    "artifacts": [
      { "name": "실행 중인/불필요한 서비스", "behavior": "악성 서비스 점검", "path": "HKLM\\SYSTEM\\CurrentControlSet\\Services, services.msc" },
      { "name": "네트워크 연결 상태", "behavior": "C&C 통신 식별", "path": "netstat -ano" }
    ],
    "tools": "services.msc, netstat -ano, TCPView",
    "dataNeeded": "라이브 시스템 접근, 명령 프롬프트 접근",
    "summary": "실행 중인 서비스와 네트워크 연결 상태를 점검하여 불필요한 서비스를 비활성화하고 의심스러운 원격 연결을 차단할 수 있다."
  },
  {
    "id": "sys_ir_advanced",
    "category": "시스템 정보 분석",
    "purpose": "보안 침해 분석",
    "level": "고급",
    "artifacts": [
      { "name": "VSS 스냅샷 / 복원 지점", "behavior": "감염 전 상태 확보", "path": "VSS 마운트 경로, C:\\System Volume Information\\" },
      { "name": "NTFS $MFT / $LogFile", "behavior": "악성코드 타임라인", "path": "C:\\$MFT, C:\\$LogFile" }
    ],
    "tools": "vssadmin, ShadowExplorer, MFTECmd",
    "dataNeeded": "관리자 권한, VSS 스냅샷, $MFT 파일",
    "summary": "VSS 스냅샷과 NTFS 메타데이터를 활용하여 악성코드 감염 전 시스템 상태로 복원하고 침해 사고의 전체 타임라인을 정교하게 재구성할 수 있다."
  },
  {
    "id": "reg_edu_basic",
    "category": "레지스트리 분석",
    "purpose": "기본 보안",
    "level": "초급",
    "artifacts": [
      { "name": "자동 실행 프로그램", "behavior": "시작 프로그램 점검", "path": "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" },
      { "name": "최근 문서 목록", "behavior": "개인 활동 내역", "path": "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\RecentDocs" }
    ],
    "tools": "regedit.exe, Autoruns",
    "dataNeeded": "라이브 시스템 접근",
    "summary": "레지스트리 편집기를 통해 자동 실행 프로그램과 최근 문서 목록을 확인하고, 의심스러운 항목을 조기에 발견하여 보안을 강화할 수 있다."
  },
  {
    "id": "reg_edu_intermediate",
    "category": "레지스트리 분석",
    "purpose": "기본 보안",
    "level": "중급",
    "artifacts": [
      { "name": "레지스트리 키 백업", "behavior": "시스템 안전성 확보", "path": "사용자 지정 경로 (.reg 파일)" },
      { "name": "의심 프로그램 경로", "behavior": "악성 여부 검증", "path": "레지스트리 값에서 추출한 경로" }
    ],
    "tools": "regedit.exe (Export 기능), VirusTotal",
    "dataNeeded": "백업할 레지스트리 키, 의심스러운 파일 경로",
    "summary": "레지스트리 키를 백업하고 의심스러운 프로그램을 VirusTotal로 검증하여 안전한 시스템 관리 습관을 기를 수 있다."
  },
  {
    "id": "reg_edu_advanced",
    "category": "레지스트리 분석",
    "purpose": "기본 보안",
    "level": "고급",
    "artifacts": [
      { "name": "레지스트리 변경 로그", "behavior": "프로그램 행위 분석", "path": "Process Monitor 캡처 로그" },
      { "name": "레지스트리 변경 내역 비교", "behavior": "설치 전후 비교", "path": "RegShot 비교 결과" }
    ],
    "tools": "Process Monitor, RegShot",
    "dataNeeded": "라이브 시스템 실행 권한, 레지스트리 스냅샷",
    "summary": "Process Monitor와 RegShot을 활용하여 프로그램 실행 시 발생하는 레지스트리 변경 사항을 추적하고, 의심스러운 활동을 조기에 탐지할 수 있다."
  },
  {
    "id": "auth_edu_basic",
    "category": "계정 및 인증 분석",
    "purpose": "기본 보안",
    "level": "초급",
    "artifacts": [
      { "name": "계정 유형 확인", "behavior": "관리자/표준 권한", "path": "제어판 → 사용자 계정" },
      { "name": "계정 관리", "behavior": "불필요 계정 점검", "path": "C:\\Windows\\System32\\config\\SAM" }
    ],
    "tools": "제어판 (사용자 계정 관리), net user 명령어",
    "dataNeeded": "라이브 시스템 접근, 명령 프롬프트 접근",
    "summary": "계정 유형을 점검하고 불필요한 관리자 권한을 제거하여 시스템 보안을 강화할 수 있다."
  },
  {
    "id": "auth_edu_intermediate",
    "category": "계정 및 인증 분석",
    "purpose": "기본 보안",
    "level": "중급",
    "artifacts": [
      { "name": "로그인 시도 기록", "behavior": "비정상 접근 패턴 확인", "path": "C:\\Windows\\System32\\winevt\\Logs\\Security.evtx (ID 4624, 4625)" }
    ],
    "tools": "Event Viewer, PowerShell (Get-WinEvent)",
    "dataNeeded": "Security.evtx",
    "summary": "Event Viewer를 통해 로그인 시도 기록을 점검하고, 비정상적인 접근 패턴을 조기에 발견하여 계정 보안을 강화할 수 있다."
  },
  {
    "id": "auth_edu_advanced",
    "category": "계정 및 인증 분석",
    "purpose": "기본 보안",
    "level": "고급",
    "artifacts": [
      { "name": "이중 인증 (2FA)", "behavior": "강력한 접근 제어", "path": "온라인 서비스 계정 설정" },
      { "name": "인증 애플리케이션", "behavior": "OTP 연동", "path": "Google Authenticator, Authy 등" }
    ],
    "tools": "Google Authenticator, Authy, Microsoft Authenticator",
    "dataNeeded": "온라인 계정 접근 권한, Microsoft 계정",
    "summary": "이중 인증을 활성화하여 계정 탈취 위험을 크게 줄이고, 온라인 계정 보안을 강력하게 보호할 수 있다."
  },
  {
    "id": "sys_edu_basic",
    "category": "시스템 정보 분석",
    "purpose": "기본 보안",
    "level": "초급",
    "artifacts": [
      { "name": "시스템 정보", "behavior": "사양 및 시작 프로그램", "path": "C:\\Windows\\System32\\systeminfo.exe" },
      { "name": "설치된 소프트웨어 목록", "behavior": "불필요 프로그램 점검", "path": "제어판 → 프로그램 및 기능" }
    ],
    "tools": "msinfo32, 프로그램 및 기능 (제어판)",
    "dataNeeded": "라이브 시스템 접근",
    "summary": "시스템 정보 도구를 활용하여 하드웨어 사양과 설치된 소프트웨어를 점검하고, 불필요한 프로그램을 제거하여 보안을 강화할 수 있다."
  },
  {
    "id": "sys_edu_intermediate",
    "category": "시스템 정보 분석",
    "purpose": "기본 보안",
    "level": "중급",
    "artifacts": [
      { "name": "안전/불필요 소프트웨어", "behavior": "프로그램 신뢰성 검증", "path": "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall, 제어판" }
    ],
    "tools": "프로그램 및 기능, Revo Uninstaller",
    "dataNeeded": "라이브 시스템 접근, 라이브 시스템 실행",
    "summary": "설치된 소프트웨어를 점검하고 신뢰할 수 없는 프로그램을 제거하여 시스템 보안과 성능을 동시에 향상시킬 수 있다."
  },
  {
    "id": "sys_edu_advanced",
    "category": "시스템 정보 분석",
    "purpose": "기본 보안",
    "level": "고급",
    "artifacts": [
      { "name": "시스템 / 애플리케이션 로그", "behavior": "오류 및 안정성 진단", "path": "C:\\Windows\\System32\\winevt\\Logs\\System.evtx, Application.evtx" }
    ],
    "tools": "Event Viewer, Event Log Explorer",
    "dataNeeded": "system.evtx, application.evtx",
    "summary": "시스템 로그를 분석하여 오류 및 경고 이벤트를 파악하고, 문제의 근본 원인을 진단하여 시스템 안정성을 높일 수 있다."
  },
  {
    "id": "log_inv_basic",
    "category": "이벤트 로그 분석",
    "purpose": "수사 조사",
    "level": "초급",
    "artifacts": [
      { "name": "이벤트 로그", "behavior": "기본 데이터 확보 및 열람", "path": "%SystemRoot%\\System32\\Winevt\\Logs\\" }
    ],
    "tools": "Windows 내장 이벤트 뷰어, NirSoft FullEventLogView, Event Log Explorer.",
    "dataNeeded": "대상자 PC에서 추출한 원본 바이너리 파일(Security.evtx, System.evtx).",
    "summary": null
  },
  {
    "id": "log_inv_intermediate",
    "category": "이벤트 로그 분석",
    "purpose": "수사 조사",
    "level": "중급",
    "artifacts": [
      { "name": "Security.evtx / Application.evtx", "behavior": "행위 입증 및 에러 확인", "path": "%SystemRoot%\\System32\\Winevt\\Logs\\" }
    ],
    "tools": null,
    "dataNeeded": "Security.evtx 내 Event ID 1102(감사 로그 지움), Application.evtx 내 프로그램 실행 에러 로그.",
    "summary": "원하는 결과가 안 나올 수 있는 이유: 윈도우 이벤트 로그는 기본 용량(약 20MB)이 정해져 있어, 이를 초과하면 오래된 기록부터 덮어씌워지는(Overwrite) 롤링 구조이기 때문에 수개월 전의 기록은 남아있지 않을 확률이 높습니다."
  },
  {
    "id": "log_inv_advanced",
    "category": "이벤트 로그 분석",
    "purpose": "수사 조사",
    "level": "고급",
    "artifacts": [
      { "name": "VSC 및 비할당 영역", "behavior": "손상/삭제된 로그 복원", "path": "\\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy[X]\\ (VSC 내부 경로), 디스크 전체 비할당 영역(Unallocated Space)" }
    ],
    "tools": "KAPE (Kroll Artifact Parser and Extractor) - 시스템 전체를 뒤지지 않고 타겟 로그만 수 분 내에 초고속으로 파싱하여 수집하는 최신 사고 대응 툴.",
    "dataNeeded": null,
    "summary": "추가적인 조사방법: VSC(볼륨 섀도 복사본)를 마운트하여 덮어씌워지기 전의 과거 로그를 추출, 디스크의 비할당 영역에서 EVTX 고유 시그니처(ElfFile)를 카빙(Carving)하여 손상된 로그 복원"
  },
  {
    "id": "log_ir_basic",
    "category": "이벤트 로그 분석",
    "purpose": "보안 침해 분석",
    "level": "초급",
    "artifacts": [
      { "name": "이벤트 로그", "behavior": "로그 1차 필터링", "path": "%SystemRoot%\\System32\\Winevt\\Logs\\" }
    ],
    "tools": "이벤트 뷰어 내 사용자 지정 보기 필터, PowerShell(Get-EventLog)",
    "dataNeeded": "Security.evtx, 보안 감사 로그",
    "summary": null
  },
  {
    "id": "log_ir_intermediate",
    "category": "이벤트 로그 분석",
    "purpose": "보안 침해 분석",
    "level": "중급",
    "artifacts": [
      { "name": "PowerShell / TaskScheduler 로그", "behavior": "악성 스크립트 실행 분석", "path": "%SystemRoot%\\System32\\Winevt\\Logs\\" }
    ],
    "tools": null,
    "dataNeeded": "Microsoft-Windows-PowerShell%4Operational.evtx, TaskScheduler%4Operational.evtx",
    "summary": "원하는 결과가 안 나올 수 있는 이유: 공격자는 명령어를 Base64로 난독화하여 실행하므로 단순 텍스트 검색으로 잡히지 않음. GPO에서 'Script Block Logging(Event ID 4104)'이 켜져 있지 않으면 명령어 세부 내용이 아예 기록되지 않습니다."
  },
  {
    "id": "log_ir_advanced",
    "category": "이벤트 로그 분석",
    "purpose": "보안 침해 분석",
    "level": "고급",
    "artifacts": [
      { "name": "Sysmon 로그", "behavior": "고도화된 헌팅 및 상관 분석", "path": "Microsoft-Windows-Sysmon%4Operational.evtx" }
    ],
    "tools": "Velociraptor - 침해 사고 발생 시 수천 대의 엔드포인트에서 원격으로 Sysmon 로그 등을 실시간 쿼리(VQL)하고 수집하는 강력한 EDR/IR 도구.",
    "dataNeeded": null,
    "summary": "추가적인 조사 방법: 확장 모니터링 로그(Microsoft-Windows-Sysmon%4Operational.evtx 내 ID 1, 3, 11)를 활용하여, 악성 프로세스 생성부터 외부 C&C 통신, 파일 드롭까지의 일련의 과정을 하나의 타임라인으로 묶는 상관 분석 기법."
  },
  {
    "id": "log_edu_basic",
    "category": "이벤트 로그 분석",
    "purpose": "기본 보안",
    "level": "초급",
    "artifacts": [
      { "name": "System.evtx", "behavior": "로그 접근 및 오류 점검", "path": "%SystemRoot%\\System32\\Winevt\\Logs\\" }
    ],
    "tools": "윈도우 내장 이벤트 뷰어.",
    "dataNeeded": "현재 사용 중인 PC 시스템의 실시간 System.evtx",
    "summary": null
  },
  {
    "id": "log_edu_intermediate",
    "category": "이벤트 로그 분석",
    "purpose": "기본 보안",
    "level": "중급",
    "artifacts": [
      { "name": "Security.evtx", "behavior": "감사 정책 메커니즘 이해", "path": "%SystemRoot%\\System32\\Winevt\\Logs\\" }
    ],
    "tools": null,
    "dataNeeded": "Security.evtx 내의 감사 성공/실패 기록.",
    "summary": "원하는 결과가 안 나올 수 있는 이유: 시스템 폴더를 누가 열어봤는지 알고 싶어도, 사전 교육(감사 정책 수동 활성화) 없이는 윈도우가 기본적으로 해당 행위를 모니터링/기록하지 않기 때문입니다."
  },
  {
    "id": "log_edu_advanced",
    "category": "이벤트 로그 분석",
    "purpose": "기본 보안",
    "level": "고급",
    "artifacts": [
      { "name": "WMI / ETW 로그", "behavior": "백그라운드 이벤트 로깅 원리", "path": "C:\\Windows\\System32\\LogFiles\\WMI\\, C:\\Windows\\Logs\\ 하위 폴더" }
    ],
    "tools": "Procmon (Process Monitor) - 파일 시스템, 레지스트리, 프로세스/스레드 활동을 실시간으로 추적하여 애플리케이션의 백그라운드 작동 원리를 시각적으로 보여주는 도구.",
    "dataNeeded": null,
    "summary": "추가적인 조사 방법: ETW(Event Tracing for Windows) 구조를 이해하고, 성능 저하를 막기 위해 사람이 읽을 수 없는 바이너리로 기록되는 .etl 파일을 파워쉘 명령어를 통해 분석 가능한 텍스트 포맷으로 변환(Parsing)하는 기법."
  },
  {
    "id": "net_inv_basic",
    "category": "네트워크 분석",
    "purpose": "수사 조사",
    "level": "초급",
    "artifacts": [
      { "name": "브라우저 SQLite DB", "behavior": "접속 기록 타임라인 구성", "path": "%LocalAppData%\\Google\\Chrome\\User Data\\Default\\ (크롬 기준), %LocalAppData%\\Microsoft\\Edge\\User Data\\Default\\ (엣지 기준)" }
    ],
    "tools": "NirSoft BrowsingHistoryView, DB Browser for SQLite.",
    "dataNeeded": "브라우저 방문 기록이 담긴 SQLite DB 파일 (History, Web Data).",
    "summary": null
  },
  {
    "id": "net_inv_intermediate",
    "category": "네트워크 분석",
    "purpose": "수사 조사",
    "level": "중급",
    "artifacts": [
      { "name": "SRUM 데이터베이스", "behavior": "네트워크 사용량 기반 유출 입증", "path": "%SystemRoot%\\System32\\sru\\" }
    ],
    "tools": null,
    "dataNeeded": "SRUDB.dat (SRUM 데이터베이스).",
    "summary": "원하는 결과가 안 나올 수 있는 이유: SRUM 데이터는 실시간 저장이 아닌 약 1시간 주기로 레지스트리에서 데이터베이스로 플러시(Flush) 되므로, 범행 직후 PC가 강제 종료되면 가장 결정적인 직전 1시간의 통신량이 저장되지 않고 유실됩니다."
  },
  {
    "id": "net_inv_advanced",
    "category": "네트워크 분석",
    "purpose": "수사 조사",
    "level": "고급",
    "artifacts": [
      { "name": "RAM 메모리 덤프", "behavior": "휘발성/은닉 네트워크 통신 추적", "path": "C:\\MEMORY.DMP, C:\\pagefile.sys, C:\\hiberfil.sys" }
    ],
    "tools": "Volatility 3 - 물리 메모리 덤프에서 netscan 플러그인을 사용하여 과거/활성 네트워크 세션을 직접 추출해 내는 포렌식 도구.",
    "dataNeeded": null,
    "summary": "추가적인 조사 방법: 피의자 PC의 램(RAM) 영역을 덤프하여 브라우저 시크릿 모드 통신 내역이나 이미 디스크에서 지워진 과거 네트워크 소켓 연결 정보를 카빙."
  },
  {
    "id": "net_ir_basic",
    "category": "네트워크 분석",
    "purpose": "보안 침해 분석",
    "level": "초급",
    "artifacts": [
      { "name": "방화벽 로그", "behavior": "외부 통신 기초 점검", "path": "%SystemRoot%\\System32\\LogFiles\\Firewall\\" }
    ],
    "tools": "메모장(Notepad++), Excel(CSV 필터 및 정렬 기능).",
    "dataNeeded": "평문 텍스트로 기록된 방화벽 로그 (pfirewall.log).",
    "summary": null
  },
  {
    "id": "net_ir_intermediate",
    "category": "네트워크 분석",
    "purpose": "보안 침해 분석",
    "level": "중급",
    "artifacts": [
      { "name": "BITS DB / DNS 캐시", "behavior": "백그라운드 통신 및 캐시 분석", "path": "%ALLUSERSPROFILE%\\Microsoft\\Network\\Downloader\\ (BITS DB), 물리적 메모리 (DNS 캐시)" }
    ],
    "tools": null,
    "dataNeeded": "BITS 데이터베이스(qmgr.db) 및 ipconfig /displaydns 명령을 통한 DNS 캐시.",
    "summary": "원하는 데로 안 나오는 이유: DNS 캐시와 같은 정보는 전원이 꺼지거나 재부팅되면 즉시 사라지는 휘발성 데이터이며, BITS 통신은 정상 시스템 트래픽에 섞여 있어 단일 로그만으로는 오탐지가 발생하기 쉽습니다."
  },
  {
    "id": "net_ir_advanced",
    "category": "네트워크 분석",
    "purpose": "보안 침해 분석",
    "level": "고급",
    "artifacts": [
      { "name": "브라우저 웹 캐시", "behavior": "암호화 통신 우회 분석", "path": "%LocalAppData%\\Google\\Chrome\\UserData\\Default\\Cache\\Cache_Data (크롬 기준)" }
    ],
    "tools": "NetworkMiner - 캡처된 패킷이나 메모리에서 비밀번호, 세션, 이미지 아티팩트 등을 자동으로 추출해 시각화해 주는 침해 사고 특화 네트워크 분석 툴.",
    "dataNeeded": null,
    "summary": "추가적인 조사 방법: 네트워크 패킷(PCAP) 자체가 HTTPS로 암호화되어 있어 볼 수 없는 상황에서, 엔드포인트(OS)에 임시 렌더링 된 웹 캐시 조각들을 조립하여 암호화 해제 전의 악성 스크립트나 피싱 화면 유추."
  },
  {
    "id": "net_edu_basic",
    "category": "네트워크 분석",
    "purpose": "기본 보안",
    "level": "초급",
    "artifacts": [
      { "name": "hosts 파일", "behavior": "로컬 네트워크 기본 점검", "path": "%SystemRoot%\\System32\\drivers\\etc\\" }
    ],
    "tools": "CMD(명령 프롬프트 - netstat -ano), 메모장",
    "dataNeeded": "시스템의 hosts 텍스트 파일",
    "summary": null
  },
  {
    "id": "net_edu_intermediate",
    "category": "네트워크 분석",
    "purpose": "기본 보안",
    "level": "중급",
    "artifacts": [
      { "name": "브라우저 Cache_Data", "behavior": "OS 통신 캐싱 메커니즘 이해", "path": "%LocalAppData%\\Google\\Chrome\\UserData\\Default\\Cache\\Cache_Data" }
    ],
    "tools": null,
    "dataNeeded": "브라우저의 Cache_Data 폴더 내 data_0, data_1 등 블록 파일",
    "summary": "원하는 대로 안 나오는 이유: 캐시 용량이 꽉 차면 오래된 데이터부터 자동으로 삭제되며, 실시간으로 변하는 동적 콘텐츠(스트리밍, 로그인 세션 등)는 보안상 디스크에 남지 않도록 설계되어 있기 때문입니다."
  },
  {
    "id": "net_edu_advanced",
    "category": "네트워크 분석",
    "purpose": "기본 보안",
    "level": "고급",
    "artifacts": [
      { "name": "네트워크 인터페이스 캡처", "behavior": "패킷 구조 및 프라이버시 이해", "path": "네트워크 인터페이스 캡처 (디스크 상의 고정된 파일 경로 없음, RAM 상에서 휘발)." }
    ],
    "tools": "Wireshark - 로컬 PC를 오가는 실제 네트워크 패킷을 캡처하여 데이터가 어떻게 캡슐화(Encapsulation)되고 전송되는지 프로토콜 레벨에서 시각적으로 교육할 수 있는 산업 표준 도구",
    "dataNeeded": null,
    "summary": "추가적인 조사 방법: 브라우저의 시크릿 모드(Incognito) 작동 시 디스크 쓰기 방지 원리를 학습하고, 로컬 디스크에 아티팩트가 남지 않아도 ISP(인터넷 제공자) 단에는 기록이 전송되는 구조적 차이점 분석"
  }
];

export const levels = ["초급", "중급", "고급"] as const;
export const purposes = [
  "수사 조사",
  "보안 침해 분석",
  "기본 보안",
] as const;
export const categories = [
  "사용자 행위",
  "레지스트리 분석",
  "계정 및 인증 분석",
  "시스템 정보 분석",
  "이벤트 로그 분석",
  "네트워크 분석",
] as const;

export type Level = (typeof levels)[number];
export type Purpose = (typeof purposes)[number];
