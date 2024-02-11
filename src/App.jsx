import React from "react";
import "./App.css";

class ElectricKettle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOn: false, // Состояние чайника (включен/выключен)
      waterLevel: 0, // Уровень воды в чайнике (от 0 до 1)
      temperature: 20, // Текущая температура воды в чайнике
      timer: null, // Идентификатор таймера для повышения температуры
      cooldownTimer: null, // Идентификатор таймера для снижения температуры после выключения
      message: "" // Сообщение о состоянии чайника
    };
  }

  // Метод для включения чайника
  turnOn() {
    const { waterLevel, isOn } = this.state;
    if (waterLevel === 0) {
      this.setState({ message: "Залейте воду в чайник, чтобы включить" });
    } else if (!isOn) {
      // Если чайник выключен и уровень воды не нулевой, включаем чайник
      this.setState({ isOn: true, message: "Чайник включен" });
      const timer = setInterval(() => {
        // Увеличиваем температуру каждую секунду
        this.setState(prevState => ({
          temperature: Math.min(prevState.temperature + 8, 100)
        }));
        this.checkBoiling(); // Проверяем, достигла ли температура кипения
      }, 1000);
      this.setState({ timer });
    }
  }

  // Метод для выключения чайника
  turnOff() {
    const { timer, cooldownTimer } = this.state;
    if (timer) clearInterval(timer);
    if (cooldownTimer) clearInterval(cooldownTimer); // Очищаем интервал охлаждения
    this.cooldown();
    this.setState({ isOn: false, message: "Чайник выключен" });
  }

  // Обработчик изменения уровня воды
  handleWaterLevelChange(event) {
    const level = parseFloat(event.target.value);
    this.setState({
      waterLevel: level,
      message: `Уровень воды установлен на ${level}`
    });
  }

  // Проверяем, достигла ли температура кипения
  checkBoiling() {
    const { temperature } = this.state;
    if (temperature === 100) {
      clearInterval(this.state.timer); // Очищаем таймер включения
      this.setState({ isOn: false, message: "Чайник вскипел" });
    }
  }

  // Охлаждение чайника после выключения
  cooldown() {
    const cooldownTimer = setInterval(() => {
      const { isOn, temperature } = this.state;
      if (!isOn && temperature > 20) {
        // Если чайник выключен и температура выше 20°C, уменьшаем температуру на 1°C каждую секунду
        this.setState(prevState => ({
          temperature: Math.max(prevState.temperature - 1, 20)
        }));
      }
    }, 1000);
    this.setState({ cooldownTimer }); // Сохраняем идентификатор интервала охлаждения
  }

  render() {
    const { isOn, waterLevel, temperature, message } = this.state;
    return (
      <div className="container">
        <h1>Симулятор электрического чайника</h1>
        <div className="kettle-status">{message}</div>
        <div className="kettle-water-level">Уровень воды: {waterLevel}</div>
        <div className="kettle-temperature">
          Температура: {temperature}°C
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={waterLevel}
          onChange={this.handleWaterLevelChange.bind(this)}
          disabled={isOn}
        />
        <button onClick={this.turnOn.bind(this)} disabled={isOn}>
          Включить
        </button>
        <button onClick={this.turnOff.bind(this)} disabled={!isOn}>
          Выключить
        </button>
      </div>
    );
  }
}

export default function App() {
  return <ElectricKettle />;
}
