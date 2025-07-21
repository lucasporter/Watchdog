# backend/app/utils/health.py
import socket

def is_alive(address: str, port: int = 22, timeout: float = 0.5) -> bool:
    """
    Return True if a TCP connect to (address, port) succeeds within timeout.
    """
    try:
        with socket.create_connection((address, port), timeout):
            return True
    except Exception:
        return False

