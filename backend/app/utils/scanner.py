# backend/app/utils/scanner.py
import subprocess
import socket
from concurrent.futures import ThreadPoolExecutor
from typing import Optional, List, Dict

def scan_ip(prefix: str, n: int) -> Optional[Dict]:
    ip = f"{prefix}.{n}"
    # 1) determine status tag
    try:
        # basic ping
        subprocess.run(
            ["ping", "-c", "1", "-W", "1", ip],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )
        # jumbo ping
        try:
            subprocess.run(
                ["ping", "-c", "1", "-W", "1", "-s", "8972", "-M", "do", ip],
                check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
            )
            tag = "GREEN"
        except subprocess.CalledProcessError:
            tag = "BLUE"
    except subprocess.CalledProcessError:
        tag = "RED"

    # 2) resolve hostname if possible
    hostname: Optional[str] = None
    try:
        hostname = socket.gethostbyaddr(ip)[0]
    except Exception:
        pass

    # 3) filter: only include if not RED *or* has a hostname
    if tag == "RED" and not hostname:
        return None

    return {"address": ip, "hostname": hostname or "", "status": tag}

def scan_subnet(prefix: str, workers: int = 32) -> List[Dict]:
    """
    Scan 1–254 on `prefix` (e.g. "192.168.1"), returns list of scan results.
    """
    with ThreadPoolExecutor(max_workers=workers) as exe:
        futures = [exe.submit(scan_ip, prefix, i) for i in range(1, 255)]
        results = [f.result() for f in futures if f.result() is not None]
    # sort by last octet
    return sorted(results, key=lambda r: int(r["address"].split(".")[-1]))

