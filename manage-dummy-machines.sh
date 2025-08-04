#!/bin/bash

# Dummy Machines Management Script
# This script helps you manage and test the dummy Linux machines

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       - Start all dummy machines"
    echo "  stop        - Stop all dummy machines"
    echo "  restart     - Restart all dummy machines"
    echo "  status      - Show status of all machines"
    echo "  logs        - Show logs for all machines"
    echo "  test        - Test connectivity to all machines"
    echo "  ssh [name]  - SSH into a specific machine"
    echo "  list        - List all available machines"
    echo "  help        - Show this help message"
    echo ""
    echo "Machine names: web-server-1, db-server-1, app-server-1, lb-server-1, monitoring-server-1"
}

# Function to start machines
start_machines() {
    print_header "Starting Dummy Machines"
    print_status "Starting all dummy Linux machines..."
    docker compose up -d web-server-1 db-server-1 app-server-1 lb-server-1 monitoring-server-1
    print_status "Waiting for machines to initialize..."
    sleep 30
    print_status "Dummy machines started successfully!"
}

# Function to stop machines
stop_machines() {
    print_header "Stopping Dummy Machines"
    print_status "Stopping all dummy Linux machines..."
    docker compose stop web-server-1 db-server-1 app-server-1 lb-server-1 monitoring-server-1
    print_status "Dummy machines stopped successfully!"
}

# Function to restart machines
restart_machines() {
    print_header "Restarting Dummy Machines"
    stop_machines
    start_machines
}

# Function to show status
show_status() {
    print_header "Dummy Machines Status"
    docker compose ps web-server-1 db-server-1 app-server-1 lb-server-1 monitoring-server-1
}

# Function to show logs
show_logs() {
    print_header "Dummy Machines Logs"
    docker compose logs --tail=20 web-server-1 db-server-1 app-server-1 lb-server-1 monitoring-server-1
}

# Function to test connectivity
test_connectivity() {
    print_header "Testing Machine Connectivity"
    
    local machines=(
        "web-server-1:8081"
        "app-server-1:3000"
        "lb-server-1:8082"
        "monitoring-server-1:9090"
    )
    
    for machine in "${machines[@]}"; do
        local name=$(echo $machine | cut -d: -f1)
        local port=$(echo $machine | cut -d: -f2)
        
        print_status "Testing $name on port $port..."
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:$port | grep -q "200"; then
            print_status "✅ $name is responding on port $port"
        else
            print_warning "❌ $name is not responding on port $port"
        fi
    done
    
    print_status "Testing SSH connections..."
    local ssh_ports=(2221 2222 2223 2224 2225)
    for port in "${ssh_ports[@]}"; do
        if nc -z localhost $port 2>/dev/null; then
            print_status "✅ SSH port $port is open"
        else
            print_warning "❌ SSH port $port is not open"
        fi
    done
}

# Function to SSH into a machine
ssh_machine() {
    local machine_name=$1
    
    case $machine_name in
        "web-server-1")
            print_status "Connecting to web-server-1 (Ubuntu 22.04)..."
            ssh root@localhost -p 2221
            ;;
        "db-server-1")
            print_status "Connecting to db-server-1 (CentOS 7)..."
            ssh root@localhost -p 2222
            ;;
        "app-server-1")
            print_status "Connecting to app-server-1 (Debian 11)..."
            ssh root@localhost -p 2223
            ;;
        "lb-server-1")
            print_status "Connecting to lb-server-1 (Alpine Linux)..."
            ssh root@localhost -p 2224
            ;;
        "monitoring-server-1")
            print_status "Connecting to monitoring-server-1 (Ubuntu 20.04)..."
            ssh root@localhost -p 2225
            ;;
        *)
            print_error "Unknown machine: $machine_name"
            echo "Available machines: web-server-1, db-server-1, app-server-1, lb-server-1, monitoring-server-1"
            exit 1
            ;;
    esac
}

# Function to list machines
list_machines() {
    print_header "Available Dummy Machines"
    echo "1. web-server-1 (Ubuntu 22.04)"
    echo "   - SSH: localhost:2221"
    echo "   - HTTP: localhost:8081"
    echo "   - Services: Apache2, SSH"
    echo ""
    echo "2. db-server-1 (CentOS 7)"
    echo "   - SSH: localhost:2222"
    echo "   - MySQL: localhost:3306"
    echo "   - Services: MySQL, SSH"
    echo ""
    echo "3. app-server-1 (Debian 11)"
    echo "   - SSH: localhost:2223"
    echo "   - Node.js: localhost:3000"
    echo "   - Services: Node.js, SSH"
    echo ""
    echo "4. lb-server-1 (Alpine Linux)"
    echo "   - SSH: localhost:2224"
    echo "   - Nginx: localhost:8082"
    echo "   - Services: Nginx, SSH"
    echo ""
    echo "5. monitoring-server-1 (Ubuntu 20.04)"
    echo "   - SSH: localhost:2225"
    echo "   - Flask: localhost:9090"
    echo "   - Services: Flask app, SSH"
    echo ""
    echo "All machines use password: password123"
}

# Main script logic
case "${1:-help}" in
    "start")
        start_machines
        ;;
    "stop")
        stop_machines
        ;;
    "restart")
        restart_machines
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "test")
        test_connectivity
        ;;
    "ssh")
        if [ -z "$2" ]; then
            print_error "Please specify a machine name"
            echo "Usage: $0 ssh [machine-name]"
            echo "Available machines: web-server-1, db-server-1, app-server-1, lb-server-1, monitoring-server-1"
            exit 1
        fi
        ssh_machine "$2"
        ;;
    "list")
        list_machines
        ;;
    "help"|*)
        show_usage
        ;;
esac 